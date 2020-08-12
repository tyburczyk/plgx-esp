import mapNodeToEIQEndpoint, { Node } from '../utils/mapNodeToEIQEndpoint'
import { getAlertIdBySightingId } from '../utils/sightingId'
import getSTIXDeterministicUUID from '../utils/getSTIXDeterministicUUID'

async function resolveSightingSightedOnRelationship(
  root: NexusGen['rootTypes']['Sighting'],
  // @ts-ignore
  _args,
  context: NexusContext,
  // @ts-ignore
  _info
): Promise<Partial<NexusGen['rootTypes']['Relationship']>[] | null> {
  let node = (await context.db.alert
    .findOne({
      where: {
        id: getAlertIdBySightingId(root.id)
      }
    })
    .node()) as Node

  return node
    ? [
        {
          id: getSTIXDeterministicUUID(
            'relationship--',
            `${node.id}-${root.id}`
          ),
          target: mapNodeToEIQEndpoint(node),
          relationship_type: 'sighted_on'
        }
      ]
    : null
}

export { resolveSightingSightedOnRelationship }
