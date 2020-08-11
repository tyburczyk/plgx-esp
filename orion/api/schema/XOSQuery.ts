import { schema } from 'nexus'

schema.objectType({
  name: 'XOSQuery',
  definition(t) {
    t.string('id')
    t.string('created')
    t.field('created_by', {
      type: 'Identity',
    })
    t.string('description')
    t.string('detection_query')
    // t.list.string("external_references")
    // t.model.granular_markings()
    t.string('modified')
    t.string('name')
    // t.list.string("object_markings")
    t.list.string('platforms')
    t.string('schema')
    t.string('version')
  },
})
