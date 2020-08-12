import { schema } from 'nexus'

schema.objectType({
  name: 'Relationship',
  description:
    'The Relationship object is used to link together two SDOs in order to describe how they are related to each other.',
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

    t.date('created', {
      description:
        'The created property represents the time at which the first version of this\nobject was created. The timestamp value MUST be precise to the nearest millisecond.'
    })

    t.date('modified', {
      description:
        'The modified property represents the time that this particular version of the\nobject was modified. The timstamp value MUST be precise to the nearest millisecond.'
    })

    t.boolean('revoked', {
      nullable: true,
      description:
        'The revoked property indicates whether the object has been revoked.'
    })

    t.int('confidence', {
      nullable: true,
      description:
        'Identifies the confidence that the creator has in the correctness of their data.'
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

    t.string('relationship_type', {
      description: 'The name used to identify the type of relationship.'
    })

    t.string('description', {
      nullable: true,
      description:
        'A description that helps provide context about the relationship.'
    })

    t.string('source_ref', {
      description: 'The ID of the source (from) object.'
    })

    t.string('target_ref', {
      description: 'The ID of the target (to) object.'
    })

    t.string('start_time', {
      nullable: true,
      description:
        'This optional timestamp represents the earliest time at which the Relationship\nbetween the objects exists. If this property is a future timestamp, at the\ntime the updated property is defined, then this represents an estimate by the\nproducer of the intelligence of the earliest time at which relationship will\nbe asserted to be true.'
    })

    t.string('stop_time', {
      nullable: true,
      description:
        'The latest time at which the Relationship between the objects exists. If this\nproperty is a future timestamp, at the time the updated property is defined,\nthen this represents an estimate by the producer of the intelligence of the\nlatest time at which relationship will be asserted to be true.'
    })

    t.field('source', {
      type: 'STIXEntity'
    })

    t.field('target', {
      type: 'STIXEntity'
    })
  }
})

schema.inputObjectType({
  name: 'RelationshipsInWhereInput',
  definition(t) {
    t.field('id', { type: 'StringFilter' })
    t.field('source_ref', { type: 'StringFilter' })
    t.field('relationship_type', { type: 'StringFilter' })
    t.list.field('AND', { type: 'RelationshipsInWhereInput' })
    t.list.field('OR', { type: 'RelationshipsInWhereInput' })
    t.list.field('NOT', { type: 'RelationshipsInWhereInput' })
  }
})

schema.inputObjectType({
  name: 'RelationshipsOutWhereInput',
  definition(t) {
    t.field('id', { type: 'StringFilter' })
    t.field('target_ref', { type: 'StringFilter' })
    t.field('relationship_type', { type: 'StringFilter' })
    t.list.field('AND', { type: 'RelationshipsOutWhereInput' })
    t.list.field('OR', { type: 'RelationshipsOutWhereInput' })
    t.list.field('NOT', { type: 'RelationshipsOutWhereInput' })
  }
})
