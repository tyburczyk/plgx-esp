import { schema } from 'nexus'
import { getRelationshipsOutDefinition } from './utils/relationshipDefinition'
import { arg, intArg } from 'nexus/components/schema'
import { getAlertIdBySightingId } from './utils/sightingId'
import mapAlertToSighting from './utils/mapAlertToSighting'
import titleCase from './utils/titleCase'

schema.inputObjectType({
  name: 'SightingWhereUniqueInput',
  definition(t) {
    t.id('id', { required: true })
  }
})

schema.inputObjectType({
  name: 'SightingWhereInput',
  definition(t) {
    t.string('id')
    t.string('search')
  }
})

schema.objectType({
  name: 'Sighting',
  definition(t) {
    t.id('id', { nullable: false })

    t.field('created_by', {
      type: 'Identity'
    })

    t.list.string('labels')

    t.date('created')

    t.string('modified')

    t.boolean('revoked')

    t.int('confidence')

    t.string('lang')

    t.string('description')

    t.string('first_seen')

    t.string('last_seen')

    t.field('sighting_of', {
      type: 'Indicator'
    })

    t.int('count')

    t.list.string('observed_data')

    t.list.field('where_sighted', { type: 'Identity' })

    t.boolean('summary')

    getRelationshipsOutDefinition(t)
  }
})

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('sighting', {
      type: 'Sighting',
      args: {
        where: arg({
          type: 'SightingWhereUniqueInput',
          required: true
        })
      },
      // @ts-ignore
      resolve: async function sightingResolver(root, args, context) {
        let alertId = getAlertIdBySightingId(args.where.id)

        let alert = await context.db.alert.findOne({
          where: {
            id: alertId
          },
          include: {
            rule: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        })

        let alertsCount = await context.db.alert.count({
          where: {
            rule_id: alert?.rule_id
          }
        })

        if (!alert) {
          return
        }

        let sighting = mapAlertToSighting(alert, alertsCount)

        return sighting
      }
    })

    t.list.field('sightings', {
      type: 'Sighting',
      args: {
        where: arg({
          type: 'SightingWhereInput'
        }),
        first: intArg(),
        after: arg({
          type: 'SightingWhereUniqueInput'
        })
      },
      // @ts-ignore
      resolve: async function sightingsResolver(root, args, context) {
        let alerts = await context.db.alert.findMany({
          take: args.first || 20,
          ...(args.after
            ? {
                skip: 1,
                cursor: {
                  id: getAlertIdBySightingId(args.after.id)
                }
              }
            : undefined),
          orderBy: {
            id: 'desc'
          },
          where: {
            OR: [
              {
                query_name: {
                  contains: args.where?.search || undefined
                }
              },
              {
                rule: {
                  OR: [
                    {
                      name: {
                        contains: args.where?.search || undefined
                      }
                    },
                    {
                      name: {
                        contains: args.where?.search?.toLowerCase() || undefined
                      }
                    },
                    {
                      name: {
                        contains: args.where?.search?.toUpperCase() || undefined
                      }
                    },
                    {
                      name: {
                        contains: titleCase(args.where?.search || '')
                      }
                    }
                  ]
                }
              }
            ]
          },
          include: {
            rule: {
              select: {
                id: true,
                name: true,
                description: true,
                conditions: true
              }
            },
            node: {
              select: {
                id: true,
                is_active: true,
                enrolled_on: true,
                last_checkin: true,
                host_identifier: true,
                node_info: true
              }
            }
          }
        })

        let sightings = alerts.map((alert) => mapAlertToSighting(alert, null))

        return sightings
      }
    })
  }
})
