import { schema, log } from 'nexus'
import { blocks } from 'nexus/components/schema'

let stixToGraphQLMap: Record<string, string> = {
  indicator: 'Indicator',
  'attack-pattern': 'AttackPattern',
  malware: 'Malware',
  'x-eiq-osquery': 'XOSQuery',
  'x-eiq-endpoint': 'XEIQEndpoint',
  identity: 'Identity',
  relationship: 'Relationship',
  tool: 'Tool',
  'intrusion-set': 'IntrusionSet'
}

schema.unionType({
  name: 'STIXEntity',
  definition(t) {
    t.members(
      'AutonomousSystem',
      'DomainName',
      'Identity',
      'Indicator',
      'IntrusionSet',
      'Ipv4Addr',
      'Ipv6Addr',
      'MacAddr',
      'XOSQuery',
      'XEIQEndpoint'
    )

    // @ts-ignore
    t.resolveType((record) => {
      // @ts-ignore
      let stixType = record.id.split('--')[0]
      let gqlType = stixToGraphQLMap[stixType]

      return gqlType
    })
  }
})
