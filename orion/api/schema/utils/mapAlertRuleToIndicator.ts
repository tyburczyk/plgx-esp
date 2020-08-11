import getSTIXDeterministicUUID from './getSTIXDeterministicUUID'

type Rule = Partial<NexusPrismaGen['models']['rule']>

function mapAlertRuleToIndicator(
  rule: Rule,
): NexusGen['rootTypes']['Indicator'] | null {
  let id = rule?.name || ''
  let isRuleNameSTIX = id?.includes('indicator--')

  if (!isRuleNameSTIX) {
    return null
  }

  return {
    id,
    name: rule.description || rule.name,
    pattern: JSON.stringify(rule.conditions),
    pattern_type: 'x-eiq-detection-rule',
    // created: new Date(rule.updated_at || '').toISOString(),
    // modified: new Date(rule.updated_at || '').toISOString(),
    pattern_version: '0.0.1',
  }
}

export default mapAlertRuleToIndicator
