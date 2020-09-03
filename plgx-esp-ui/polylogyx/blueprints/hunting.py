import datetime

from flask_restplus import Namespace, Resource
from flask import jsonify

from .utils import *
from polylogyx.utils import require_api_key
from polylogyx.models import Alerts, Rule, ResultLog


ns = Namespace('hunting', description='Hunting related operations')


@require_api_key
@ns.route('/pack/<string:pack_id>/alerts', endpoint="pack_alerts")
@ns.doc(params={'host_identifier': 'Host identifier of the Node', 'start_time': 'start time of alerted events', 'end_time': 'end time of alerted events'})
class PackAlerts(Resource):
    parser = requestparse(['host_identifier', 'start_time', 'end_time'],
                          [str, datetime.datetime.fromtimestamp, datetime.datetime.fromtimestamp],
                          ["host identifier of the node", "start time of alerted events", "end time of alerted events"],
                          [False, False, False])

    @ns.expect(parser)
    def post(self, pack_id):
        args = self.parser.parse_args()
        # TODO: rename in the pack:
        pack_id = f"hunting-pack--{pack_id}"
        rules = Rule.query.join(Rule.alerts).filter(Rule.name.startswith(pack_id))
        # TODO: use some node id + join it and not pk
        if args["host_identifier"]:
            rules = rules.filter(Alerts.node_id == args["host_identifier"])
        if args["start_time"]:
            rules = rules.filter(Alerts.created_at >= args["start_time"])
        if args["end_time"]:
            rules = rules.filter(Alerts.created_at <= args["end_time"])

        data = {}
        for rule in rules.options(db.contains_eager(Rule.alerts)).all():
            # TODO make it more dry (if possible)
            technique_id, query_id = rule.name.split('--')[2].split('.')
            rule_name = rule.description.split('--')[2]
            # TODO: get relevant alert data here:
            data[rule_name] = {
                "technique_id": technique_id,
                "query_id": query_id,
                "alerts": [alert.to_dict() for alert in rule.alerts]
            }

        return jsonify(data)


@require_api_key
@ns.route('/query/<string:technique_id>/<int:query_id>/results', endpoint="query_results")
@ns.doc(params={'host_identifier': 'Host identifier of the Node', 'start_time': 'start time of alerted events', 'end_time': 'end time of alerted events'})
class QueryResults(Resource):
    parser = requestparse(['host_identifier', 'start_time', 'end_time'],
                          [str, datetime.datetime.fromtimestamp, datetime.datetime.fromtimestamp],
                          ["host identifier of the node", "start time of alerted events", "end time of alerted events"],
                          [False, False, False])

    @ns.expect(parser)
    def post(self, technique_id, query_id):
        args = self.parser.parse_args()
        # TODO: add some nice validation (after cleaning naming)
        query_name = f"pack/hunting_queries/test_{technique_id}.{query_id}"

        results = ResultLog.query.filter(ResultLog.name == query_name)
        # TODO: use some node id + join it and not pk
        if args["host_identifier"]:
            results = results.filter(ResultLog.node_id == args["host_identifier"])
        if args["start_time"]:
            rules = results.filter(ResultLog.timestamp >= args["start_time"])
        if args["end_time"]:
            rules = results.filter(ResultLog.timestamp <= args["end_time"])

        data = [result.to_dict() for result in results.all()]

        return jsonify(data)
