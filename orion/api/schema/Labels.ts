import { schema } from 'nexus'

schema.objectType({
  name: 'tag',
  definition(t) {
    t.model.id()
    t.model.value()
  },
})
