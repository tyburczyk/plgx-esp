import { schema } from 'nexus'

schema.objectType({
  name: 'MarkingDefinition',
  definition(t) {
    t.string('id', {
      description:
        'The id property universally and uniquely identifies this object.'
    })

    t.date('created', {
      description:
        'The created property represents the time at which the first version of this\nobject was created. The timestamp value MUST be precise to the nearest millisecond.'
    })

    t.field('created_by', {
      type: 'Identity',
      nullable: true,
      description:
        'The identity object that describes the entity that created this object'
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

    t.string('name', {
      nullable: true,
      description: 'A name used to identify the Marking Definition.'
    })

    t.string('definition_type', {
      description:
        'The definition_type property identifies the type of Marking Definition.'
    })

    t.json('definition', {
      description: 'The definition property contains the marking object itself'
    })
  }
})
