import getSTIXDeterministicUUID from './getSTIXDeterministicUUID'
import mapAlertToIndicator from './mapAlertToIndicator'
import mapNodeToIdentity from './mapNodeToIdentity'
import { NodeInfo } from './mapNodeToEIQEndpoint'
import mapAlertRuleToIndicator from './mapAlertRuleToIndicator'
import XDRIdentity from './XDRIdentity'

const POLYLOGYX_SERVICE_IDENTITY = {
  __typename: 'Identity',
  id: getSTIXDeterministicUUID('identity', 'PolylogyxService'),
  type: 'identity',
  spec_version: '2.1',
  labels: ['Polylogyx Service'],
  created: '',
  modified: '',
  revoked: false,
  confidence: 100,
  lang: 'eng',
  name: 'Polylogyx',
  description: 'The Polylogyx service',
  identity_class: 'system',
  sectors: [],
  contact_information: ''
}
type Alert = NexusPrismaGen['models']['alert'] & {
  rule: {
    name: string
    description: string | null
    id: number
  } | null
}

function mapAlertToSighting(alert: Alert, totalCount: number | null) {
  return {
    __typename: 'Sighting',
    id: `sighting-${alert.id}`,
    confidence: 100,
    created: new Date(alert.created_at).toISOString(),
    modified: new Date(alert.created_at).toISOString(),
    revoked: false,
    sighting_of: mapAlertRuleToIndicator(alert.rule || {}),
    spec_version: '2.1',
    summary: false,
    created_by: POLYLOGYX_SERVICE_IDENTITY,
    description: `Created by the query ${alert.query_name}`,
    labels: [alert.severity],
    where_sighted: [XDRIdentity],
    observed_data: [JSON.stringify(alert.message)],
    count: totalCount,
    first_seen: new Date(alert.created_at).toISOString(),
    last_seen: new Date(alert.created_at).toISOString(),
    lang: 'en'
  }
}

export default mapAlertToSighting
