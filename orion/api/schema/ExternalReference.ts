import { schema } from 'nexus'

schema.objectType({
  name: 'ExternalReference',
  description:
    'External references are used to describe pointers to information represented outside of STIX.',
  definition(t) {
    t.string('source_name', {
      description:
        'The name of the source that the external-reference is defined within (system, registry, organization, etc.).'
    })

    t.string('description', {
      nullable: true,
      description: 'A human readable description'
    })

    t.string('url', {
      nullable: true,
      description: 'A URL reference to an external resource.'
    })

    t.json('hashes', {
      nullable: true,
      description:
        'Specifies a dictionary of hashes for the contents of the url.\nThis SHOULD be provided when the url property is present.'
    })

    t.string('external_id', {
      nullable: true,
      description: 'An identifier for the external reference content.'
    })
  }
})
