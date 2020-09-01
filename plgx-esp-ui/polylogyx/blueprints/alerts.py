import datetime
import json
from sqlalchemy import cast

from flask_restplus import Namespace, Resource, marshal
from flask import request, jsonify


from .utils import *
from polylogyx.utils import require_api_key
from polylogyx.models import Alerts, Rule
from polylogyx.dao import alerts_dao as dao
from polylogyx.dao import nodes_dao as node_dao
from polylogyx.dao import rules_dao as rule_dao
from polylogyx.dao import distributed_dao as distributed_dao
from polylogyx.wrappers import alert_wrappers as alert_wrapper
from polylogyx.wrappers import node_wrappers as node_wrapper
from polylogyx.wrappers import parent_wrappers as parentwrapper


ns = Namespace('alerts', description='Alerts related operations')


@require_api_key
@ns.route('/', endpoint='alerts_post')
@ns.doc(params={'host_identifier': 'Host identifier of the Node', 'rule_id':'rule id', 'query_name':'query name'})
class ViewAlerts(Resource):
    '''views the alerts'''
    parser = requestparse(['host_identifier', 'rule_id', 'query_name'], [str, int, str], ["host identifier of the node", "rule id", "query name"], [False, False, False])

    @ns.expect(parser)
    def post(self):
        args = self.parser.parse_args()

        host_identifier = args['host_identifier']
        rule_id = args['rule_id']
        query_name = args['query_name']
        data_valid = True

        if host_identifier: node = node_dao.get_node_by_host_identifier(host_identifier)
        else: node = None

        alert_results = dao.get_alerts_for_input(node,rule_id,query_name)
        data = alert_results[0]
        message = alert_results[1]

        if not data: status="failure";
        else: data = add_rule_name_to_alerts_response(marshal(data, alert_wrapper.alerts_wrapper, skip_none=True)); message = "Successfully received the alerts"; status = "success";

        return marshal(respcls(message,status,data), parentwrapper.common_response_wrapper, skip_none=True)



@require_api_key
@ns.route('/data/<int:alert_id>', endpoint = "alerts_data")
@ns.doc(params = {'alert_id':"id of the alert"})
class AlertsData(Resource):
    '''returns alert data'''

    def get(self,alert_id):
        data = {}
        if not alert_id:
            return marshal(respcls("Please! Provide the alert id", "failure"), parentwrapper.common_response_wrapper, skip_none=True)

        alert = dao.get_alert_by_id(alert_id)

        time = 0
        if alert:
            if 'time' in alert.message:
                time = alert.message['time']
            time = int(time)

            data['alert'] = marshal(alert, alert_wrapper.alerts_data_wrapper)
            data['node'] = alert.node.host_identifier
            message = "data is fetched successfully"
            status = "success"

        else:
            message = "there is no alert with this id"
            status = "failure"
            data = None
        if not data: message="alerts data doesn't exists for the input given"
        return marshal(respcls(message,status,data), parentwrapper.common_response_wrapper,skip_none=True)


@require_api_key
@ns.route('/hunting-pack/<string:pack_id>', endpoint="pack_alerts")
@ns.doc(params={'host_identifier': 'Host identifier of the Node', 'start_time': 'start time of alerted events', 'end_time': 'end time of alerted events'})
class PackAlerts(Resource):
    parser = requestparse(['host_identifier', 'start_time', 'end_time'],
                          [str, datetime.datetime.fromtimestamp, datetime.datetime.fromtimestamp],
                          ["host identifier of the node", "start time of alerted events", "end time of alerted events"],
                          [False, False, False])

    @ns.expect(parser)
    def post(self, pack_id):
        args = self.parser.parse_args()
        # TODO: move it to dao?
        # TODO: rename in the pack:
        pack_id = f"hunting-pack--{pack_id}"
        rules = Rule.query.join(Rule.alerts).filter(Rule.name.startswith(pack_id))
        # TODO: use some node id + join it
        if args["host_identifier"]:
            rules = rules.filter(Alerts.node_id == args["host_identifier"])
        if args["start_time"]:
            rules = rules.filter(Alerts.created_at >= args["start_time"])
        if args["end_time"]:
            rules = rules.filter(Alerts.created_at <= args["end_time"])

        rules = rules.options(db.contains_eager(Rule.alerts)).all()
        data = {
            rule.name: [
                {
                    "node_id": alert.node_id
                }
                for alert in rule.alerts
            ] for rule in rules
        }

        return jsonify(data)
