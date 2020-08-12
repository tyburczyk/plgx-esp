import { schema } from 'nexus'

schema.objectType({
  name: 'IntrusionSet',
  description:
    'An Intrusion Set is a grouped set of adversary behavior and resources with\ncommon properties that is believed to be orchestrated by a single organization.',
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

    t.string('name', {
      description: 'The name used to identify the Intrusion Set.'
    })

    t.string('description', {
      nullable: true,
      description:
        'Provides more context and details about the Intrusion Set object.'
    })

    t.list.string('aliases', {
      nullable: true,
      description: 'Alternative names used to identify this Intrusion Set.'
    })

    t.date('first_seen', {
      nullable: true,
      description: 'The time that this Intrusion Set was first seen.'
    })

    t.date('last_seen', {
      nullable: true,
      description: 'The time that this Intrusion Set was last seen.'
    })

    t.list.string('goals', {
      nullable: true,
      description:
        'The high level goals of this Intrusion Set, namely, what are they trying to do.'
    })

    t.string('resource_level', {
      nullable: true,
      description:
        'This defines the organizational level at which this Intrusion Set typically works. Open Vocab - attack-resource-level-ov'
    })

    t.string('primary_motivation', {
      nullable: true,
      description:
        'The primary reason, motivation, or purpose behind this Intrusion Set. Open Vocab - attack-motivation-ov'
    })

    t.list.string('secondary_motivations', {
      nullable: true,
      description:
        'The secondary reasons, motivations, or purposes behind this Intrusion Set. Open Vocab - attack-motivation-ov'
    })
  }
})
