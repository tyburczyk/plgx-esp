import mapNodeToEIQEndpoint, { Node } from '../utils/mapNodeToEIQEndpoint'
import { getAlertIdBySightingId } from '../utils/sightingId'
import getSTIXDeterministicUUID from '../utils/getSTIXDeterministicUUID'
import { getNodeHostIdByXEIQEndpointId } from '../utils/xEIQEndpointId'

async function resolveXEIQEndpointDeployedToRelationship(
  root: NexusGen['rootTypes']['XEIQEndpoint'],
  // @ts-ignore
  args,
  context: NexusContext,
  // @ts-ignore
  info
): Promise<Partial<NexusGen['rootTypes']['Relationship']>[] | null> {
  let nodes = await context.db.node.findMany({
    where: {
      host_identifier: root.host_identifier
    },
    include: {
      node_tag: {
        select: {
          tag: true
        }
      }
    }
  })

  let nodeTags = nodes[0].node_tag.map((tag) => tag.tag?.value || '')
  console.log(JSON.stringify(nodeTags))

  if (!(nodeTags.length > 0)) {
    return []
  }

  let deployedPacks = await context.db.pack.findMany({
    where: {
      pack_tags: {
        some: {
          tag: {
            value: {
              in: nodeTags
            }
          }
        }
      }
    }
  })

  console.log({ deployedPacks })

  return deployedPacks
    ? deployedPacks.map((pack) => {
        return {
          id: getSTIXDeterministicUUID(
            'relationship',
            `${nodes[0].id}-${pack.id}`
          ),
          source: {
            id: pack.name,
            name: pack.description
          },
          relationship_type: 'deployed-to'
        }
      })
    : []
}

export { resolveXEIQEndpointDeployedToRelationship }
