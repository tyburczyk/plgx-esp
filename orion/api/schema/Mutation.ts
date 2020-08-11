import { schema, log } from 'nexus'
import api from '../polylogyx'
import { getNodeHostIdByXEIQEndpointId } from './utils/xEIQEndpointId'
import getSTIXDeterministicUUID from './utils/getSTIXDeterministicUUID'
import auth from './utils/auth'

schema.inputObjectType({
  name: 'XOSQueryHuntingPackInput',
  definition(t) {
    t.string('detection_query', { required: true })
    t.string('name', { required: true })
  }
})

schema.inputObjectType({
  name: 'IndicatorHuntingPackInput',
  definition(t) {
    t.string('id', { required: true })
    t.string('name', { required: true })
    t.string('pattern', { required: true })
    t.string('description')
  }
})

schema.inputObjectType({
  name: 'XHuntingPackInput',
  definition(t) {
    t.string('id', { required: true })
    t.string('name', { required: true })
    t.string('xEIQEndpointIds', { required: true, list: [true] })
    t.list.field('xOSQueries', {
      type: 'XOSQueryHuntingPackInput'
    })

    t.field('indicators', {
      type: 'IndicatorHuntingPackInput',
      list: [true],
      required: true
    })
  }
})

schema.mutationType({
  definition(t) {
    t.list.field('createXHuntingPackDeployedToXEIQEndpointRelationships', {
      type: 'Relationship',
      args: {
        input: 'XHuntingPackInput'
      },
      resolve: async function (root, args, context, info) {
        let { input } = args
        try {
          let { token } = await auth()

          let hostIdentifiers =
            input?.xEIQEndpointIds?.map(getNodeHostIdByXEIQEndpointId) || []

          let queries = input?.xOSQueries?.reduce((queriesMap, osQuery) => {
            return {
              ...queriesMap,
              [osQuery.name]: {
                query: osQuery.detection_query,
                interval: 5,
                description: osQuery.name
              }
            }
          }, {})

          let indicators = input?.indicators || []

          for (let host_identifier of hostIdentifiers) {
            log.info('host_identifier', { host_identifier })
            // For each host-identifier add the tags to the node
            let node = await api
              .post('nodes/tag/edit', {
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': token,
                  'x-user-auth-token': context.auth.token
                },
                body: JSON.stringify({
                  remove_tags: '',
                  add_tags: input?.id,
                  host_identifier: getNodeHostIdByXEIQEndpointId(
                    host_identifier
                  ).replace('identity-', '')
                })
              })
              .json()

            log.debug('NODE', { node })
          }

          log.debug('added node tags')

          // Add the rules
          for (let indicator of indicators) {
            let polylogyxRule = {
              alerters: ['email', 'debug', 'rsyslog'],
              conditions: JSON.parse(indicator.pattern),
              name: indicator.id,
              status: 'ACTIVE',
              type: 'MITRE',
              tactics: [''],
              technique_id: '',
              description: indicator.description || ''
            }

            let ruleResp = await api
              .post('rules/add', {
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': token,
                  'x-user-auth-token': context.auth.token
                },
                body: JSON.stringify(polylogyxRule)
              })
              .json()

            log.debug(
              `added indicator ${indicator.id} |\n ${JSON.stringify(ruleResp)}`
            )
          }

          let addPackBody = {
            category: 'MITRE',
            name: input?.id,
            queries,
            description: input?.name,
            tags: input?.id
          }

          log.debug('PACK_BODY:', { body: addPackBody })

          // Add the OSQueryPack and use the same tag we put on the selected nodes.
          let packResponse = (await api
            .post('packs/add', {
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
                'x-user-auth-token': context.auth.token
              },
              body: JSON.stringify(addPackBody)
            })
            .json()) as { pack_id: string }

          log.debug('ADDED PACK!!!', { packResponse })

          return [
            {
              id: getSTIXDeterministicUUID('relationship', packResponse.pack_id)
            }
          ]
        } catch (err) {
          throw new Error('Failed to deploy the hunting pack')
        }
      }
    })
  }
})
