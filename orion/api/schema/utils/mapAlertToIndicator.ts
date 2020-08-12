import getSTIXDeterministicUUID from './getSTIXDeterministicUUID'

function mapAlertToIndicator(alert: any) {
  let isRuleNameSTIX = alert?.rule?.name?.includes('indicator--')
  let id = isRuleNameSTIX
    ? alert.rule.name
    : getSTIXDeterministicUUID('indicator', alert.query_name)

  return {
    id,
    name: alert.query_name,
    __typename: 'Indicator',
    pattern: alert.rule,
    pattern_type: 'osquery'
  }
}

export default mapAlertToIndicator
