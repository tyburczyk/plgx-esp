import { schema } from 'nexus'

schema.objectType({
  name: 'AutonomousSystem',
  description:
    'The AS object represents the properties of an Autonomous Systems (AS).',
  definition(t) {
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

    t.boolean('is_defanged', {
      nullable: true,
      description:
        'Defines whether or not the data contained within the object has been defanged.'
    })

    t.string('id', {
      description:
        'Specifies the identifier of the observable object, as a string.'
    })

    t.json('extensions', {
      nullable: true,
      description: 'Specifies any extensions of the object, as a dictionary.'
    })

    t.int('number', {
      description:
        'Specifies the number assigned to the AS. Such assignments are typically performed by a Regional Internet Registries (RIR).'
    })

    t.string('name', {
      nullable: true,
      description: 'Specifies the name of the AS.'
    })

    t.string('rir', {
      nullable: true,
      description:
        'Specifies the name of the Regional Internet Registry (RIR) that assigned the number to the AS.'
    })
  }
})
