import { schema, log } from 'nexus'
import './schema/Identity'
import './schema/Sighting'
import './schema/Indicator'
import { intArg, stringArg, FieldResolver, arg } from 'nexus/components/schema'
import mapNodeToIdentity from './schema/utils/mapNodeToIdentity'
import mapAlertToSighting from './schema/utils/mapAlertToSighting'
import { mapIdentityToNodeId } from './schema/utils/mapIdentityToNode'
import mapNodeToEIQEndpoint, { Node } from './schema/utils/mapNodeToEIQEndpoint'

interface IOSQueryInput {
  name: string
  sql: string
  interval: number
  platform: ''
  version?: string
  description?: string
  snapshot?: boolean
  shard?: string
  tags: string
}

function resolveSTIXDomainObjectType({ id = '' }: { id?: string | null }) {
  if (!id) {
    return 'Indicator'
  }

  let stixTypeFromId = id.split('-')[0]

  return `${stixTypeFromId.charAt(0).toUpperCase()}${stixTypeFromId.slice(
    1
  )}` as 'Indicator' | 'Sighting' | 'Identity'
}

schema.unionType({
  name: 'STIXDomainObject',
  description: '',
  definition(t) {
    t.members('Identity', 'Indicator', 'Sighting')
    t.resolveType(resolveSTIXDomainObjectType)
  }
})

schema.queryType({
  definition(t) {
    t.list.field('tags', {
      type: 'tag',
      async resolve(root, args, ctx) {
        let tags = await ctx.db.tag.findMany({
          take: 100,
          select: {
            id: true,
            value: true
          }
        })

        return tags
      }
    })
  }
})

schema.inputObjectType({
  name: 'xPolylogyxSignInInput',
  definition(t) {
    t.string('password', { required: true })
    t.string('username', { required: true })
  }
})

schema.objectType({
  name: 'xPolylogyxSignInResult',
  definition(t) {
    t.string('token')
  }
})

schema.inputObjectType({
  name: 'IndicatorInput',
  definition(t) {
    t.string('id', { required: true })
    t.string('pattern', { required: true })
    t.string('description', { required: true })
  }
})

schema.inputObjectType({
  name: 'OSQueryInput',
  definition(t) {
    t.string('name', { required: true })
    t.string('detection_query', { required: true })
  }
})

schema.inputObjectType({
  name: 'CreateDeployedToRelationshipInput',
  definition(t) {
    t.string('intrusionSetId', { required: true })

    t.list.string('identityIds', { required: true })

    t.list.field('osQueries', {
      type: 'OSQueryInput',
      required: true
    })

    t.list.field('indicators', {
      required: true,
      type: 'IndicatorInput'
    })
  }
})
