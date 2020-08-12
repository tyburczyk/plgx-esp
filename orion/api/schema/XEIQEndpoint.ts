import { schema } from 'nexus'
import { getRelationshipsInDefinition } from './utils/relationshipDefinition'
import { arg } from 'nexus/components/schema'
import mapNodeToEIQEndpoint, { Node } from './utils/mapNodeToEIQEndpoint'

function getNodeIdByXEIQEndpointId(id = '') {
  let hostId = id.replace('x-eiq-endpoint--', '')
  return hostId
}

schema.inputObjectType({
  name: 'StringFilter',
  definition(t) {
    t.string('equals', { nullable: true })
    t.string('not', { nullable: true })
    t.list.string('in', { nullable: true })
    t.list.string('notIn', { nullable: true })
    t.string('lt', { nullable: true })
    t.string('lte', { nullable: true })
    t.string('gt', { nullable: true })
    t.string('gte', { nullable: true })
    t.string('contains', { nullable: true })
    t.string('startsWith', { nullable: true })
    t.string('endsWith', { nullable: true })
  }
})

schema.inputObjectType({
  name: 'XEIQEndpointUniqueWhereInput',
  definition(t) {
    t.string('id', { required: true })
  }
})

schema.unionType({
  name: 'IpAddr',
  definition(t) {
    t.members('Ipv4Addr', 'Ipv6Addr')
    t.resolveType(({ id = '' }) =>
      id && id.startsWith('ipv4') ? 'Ipv4Addr' : 'Ipv6Addr'
    )
  }
})

schema.enumType({
  name: 'EndpointStatusEnum',
  members: ['active', 'inactive']
})

schema.objectType({
  name: 'EndpointOperatingSystemVersion',
  definition(t) {
    t.string('major', { description: 'Major release version' })
    t.string('minor', { description: 'Minor release version' })
    t.string('patch', { description: 'Optional patch release' })
    t.string('version', {
      description: 'Pretty, suitable for presentation, OS version'
    })
  }
})

schema.objectType({
  name: 'EndpointSystemCPU',
  definition(t) {
    t.string('type', {
      description: 'CPU type'
    })
    t.string('physical_cores', {
      description: 'Number of physical CPU cores in to the system'
    })
  }
})

schema.objectType({
  name: 'EndpointSystemHardware',
  definition(t) {
    t.string('vendor', {
      description: 'Hardware vendor'
    })
    t.string('serial', {
      description: 'Device serial number'
    })
    t.string('model', {
      description: 'Hardware model'
    })
  }
})

schema.objectType({
  name: 'EndpointSystem',
  definition(t) {
    t.field('cpu', { type: 'EndpointSystemCPU' })
    t.field('hardware', { type: 'EndpointSystemHardware' })
    t.string('physical_memory')
  }
})

schema.objectType({
  name: 'EndpointOperatingSystem',
  definition(t) {
    t.string('name', { description: 'The name of the operating system' })
    t.string('build', {
      description: 'Optional build-specific or variant string about the os'
    })
    t.string('platform', { description: 'OS Platform or ID' })
    t.string('platform_like', { description: 'Closely related platforms' })
    t.string('codename', { description: 'OS version codename' })
    t.field('version', {
      type: 'EndpointOperatingSystemVersion'
    })
  }
})

schema.objectType({
  name: 'XEIQEndpoint',
  description: 'EIQEndpoints are endpoints managed by EIQ XDR',
  definition(t) {
    t.string('id', {
      description:
        'The id property universally and uniquely identifies this object.'
    })

    t.field('created_by', {
      type: 'Identity',
      nullable: true,
      description:
        'The identity object that describes the entity that created this object'
    })

    t.list.string('labels', {
      nullable: true,
      description:
        'The labels property specifies a set of terms used to describe this object.'
    })

    t.field('created', {
      type: 'DateTime',
      description:
        'The created property represents the time at which the first version of this\nobject was created. The timestamp value MUST be precise to the nearest millisecond.'
    })

    t.field('modified', {
      type: 'DateTime',
      description:
        'The modified property represents the time that this particular version of the\nobject was modified. The timstamp value MUST be precise to the nearest millisecond.'
    })
    t.boolean('revoked', {
      nullable: true,
      description:
        'The revoked property indicates whether the object has been revoked.'
    })

    t.string('lang', {
      nullable: true,
      description: 'Identifies the language of the text content in this object.'
    })

    t.list.field('external_references', {
      type: 'ExternalReference',
      nullable: true,
      description:
        'A list of external references which refers to non-STIX information.'
    })

    t.list.field('object_markings', {
      type: 'MarkingDefinition',
      nullable: true,
      description:
        'The list of marking-definition objects to be applied to this object.'
    })

    t.list.field('granular_markings', {
      type: 'GranularMarking',
      nullable: true,
      description: 'The set of granular markings that apply to this object.'
    })

    t.list.string('aliases', {
      nullable: true,
      description: 'Alternative names used to identify this Endpoint.'
    })

    t.string('name', { description: 'The name used to identify the Endpoint.' })

    t.string('description', {
      nullable: true,
      description:
        'Provides more context and details about the Endpoint object.'
    })

    t.list.field('ip_addresses', {
      type: 'IpAddr'
    })

    t.field('endpoint_status', {
      type: 'EndpointStatusEnum',
      description:
        'Describes the status of the endpoint. Active for connected endpoints'
    })

    t.field('operating_system', {
      type: 'EndpointOperatingSystem'
    })

    t.date('last_checkin')

    t.string('host_identifier', {
      description: `Unique identifier for the endpoint in the context of the server that it's enrolled`
    })

    t.field('system', {
      description: `System information for identification`,
      type: 'EndpointSystem'
    })

    getRelationshipsInDefinition(t)
  }
})

schema.inputObjectType({
  name: 'XEIQEndpointWhereInput',
  definition(t) {
    t.field('id', {
      type: 'StringFilter'
    })
    t.field('host_identifier', {
      type: 'StringFilter'
    })
    t.field('computer_name', {
      type: 'StringFilter'
    })
    t.field('operating_system', {
      type: 'StringFilter'
    })

    t.string('search')
  }
})

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('xEIQEndpoint', {
      type: 'XEIQEndpoint',
      args: {
        where: arg({
          type: 'XEIQEndpointUniqueWhereInput',
          required: true
        })
      },
      // @ts-ignore
      resolve: async function xEIQEndpointResolver(root, args, context) {
        let id = args.where.id

        let nodes = await context.db.node.findMany({
          where: {
            host_identifier: {
              equals: getNodeIdByXEIQEndpointId(args.where.id)
            }
          }
        })

        if (!nodes?.length) {
          return []
        }

        let firstNode = nodes?.[0] as Node

        let xEIQEndpoint = mapNodeToEIQEndpoint(firstNode)

        return xEIQEndpoint
      }
    })

    t.list.field('xEIQEndpoints', {
      type: 'XEIQEndpoint',
      args: {
        where: arg({
          type: 'XEIQEndpointWhereInput'
        }),
        first: arg({ type: 'Int', default: 20, required: false })
      },
      // @ts-ignore
      resolve: async function xEIQEndpointsResolver(root, args, context) {
        let nodes = (await context.db.node.findMany({
          take: args.first || 0
        })) as Node[]

        let xEIQEndpoints = nodes.map(mapNodeToEIQEndpoint)

        return xEIQEndpoints
      }
    })
  }
})
