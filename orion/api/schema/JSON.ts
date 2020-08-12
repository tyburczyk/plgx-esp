import { GraphQLJSONObject } from 'graphql-type-json'
import { schema, log } from 'nexus'

schema.scalarType({
  name: 'JSON',
  serialize: (value) => {
    log.debug(value);
    if (typeof value === 'string') {
      return GraphQLJSONObject.serialize(value)
    }

    return value
  },
  parseValue: (value) => {
    log.debug(value);
    if (typeof value === 'string') {
      return GraphQLJSONObject.parseValue(value)
    }

    return value
  },
  parseLiteral: GraphQLJSONObject.parseLiteral
})
