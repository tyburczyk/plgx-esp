import { arg, blocks } from 'nexus/components/schema'
import { resolveSightingSightedOnRelationship } from '../resolvers/resolveSightingSightedOnRelationship'
import { resolveXEIQEndpointDeployedToRelationship } from '../resolvers/resolveXEIQEndpointDeployedToRelationship'

type STIXType =
  | 'indicator'
  | 'attack-pattern'
  | 'malware'
  | 'x-eiq-osquery'
  | 'identity'
  | 'intrusion-set'
  | 'tool'
  | 'relationship'

let stixToPrismaMap: Record<STIXType, string> = {
  indicator: 'indicator',
  'attack-pattern': 'attackPattern',
  malware: 'malware',
  'x-eiq-osquery': 'xOSQuery',
  identity: 'identity',
  relationship: 'relationship',
  'intrusion-set': 'intrusionSet',
  tool: 'tool'
}

function getRelationshipsInDefinition(t: blocks.ObjectDefinitionBlock<any>) {
  t.list.field('relationshipsIn', {
    type: 'Relationship',
    args: {
      where: arg({ type: 'RelationshipsInWhereInput', required: true })
    },
    resolve: async function relationshipIn(parent, args, context, info) {
      if (args.where.relationship_type.equals == 'deployed-to') {
        return resolveXEIQEndpointDeployedToRelationship(
          parent,
          args,
          context,
          info
        )
      }
      return []
    }
  })
}

function getRelationshipsOutDefinition(t: blocks.ObjectDefinitionBlock<any>) {
  t.list.field('relationshipsOut', {
    type: 'Relationship',
    args: {
      where: arg({ type: 'RelationshipsOutWhereInput', required: true })
    },
    resolve: async function relationshipOut(parent, args, context, info) {
      if (args.where.relationship_type.equals == 'sighted_on') {
        return resolveSightingSightedOnRelationship(
          parent as NexusGen['rootTypes']['Sighting'],
          args,
          context,
          info
        )
      }
      return []
    }
  })
}

export { getRelationshipsInDefinition, getRelationshipsOutDefinition }
