import mapNodeToEIQEndpoint, { Node } from '../utils/mapNodeToEIQEndpoint'
import { getAlertIdBySightingId } from '../utils/sightingId'
import getSTIXDeterministicUUID from '../utils/getSTIXDeterministicUUID'

async function resolveHuntingPackDeployedToRelationship(
  root: { id: string },
  args,
  context: NexusContext,
  info
): Promise<Partial<NexusGen['rootTypes']['Relationship']>[] | null> {
  let nodes = (await context.db.node.findMany({
    where: {
      node_tags: {
        some: {
          tag: {
            value: {
              equals: root.id
            }
          }
        }
      }
    }
  })) as Node[]

  return nodes
    ? nodes.map((node) => {
        return {
          id: getSTIXDeterministicUUID(
            'relationship--',
            `${node.id}-${root.id}`
          ),
          target: mapNodeToEIQEndpoint(node),
          relationship_type: 'deployed-to'
        }
      })
    : []
}

export { resolveHuntingPackDeployedToRelationship }
