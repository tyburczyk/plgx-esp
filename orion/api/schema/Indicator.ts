import { schema } from 'nexus'
import { objectType, scalarType } from '@nexus/schema'

schema.objectType({
  name: 'Indicator',
  description:
    'Indicators contain a pattern that can be used to detect suspicious or malicious cyber activity.',
  definition(t) {
    t.id('id', {
      nullable: false,
      description:
        'The id property universally and uniquely identifies this object.'
    })

    t.string('created_by_ref', {
      nullable: true,
      description:
        'The ID of the Source object that describes who created this object.'
    })

    t.list.string('labels', {
      nullable: true,
      description:
        'The labels property specifies a set of terms used to describe this object.'
    })

    t.string('created', {
      description:
        'The created property represents the time at which the first version of this\nobject was created. The timstamp value MUST be precise to the nearest millisecond.'
    })

    t.string('modified', {
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

    t.list.string('object_marking_refs', {
      nullable: true,
      description:
        'The list of marking-definition objects to be applied to this object.'
    })

    t.list.string('indicator_types', {
      description:
        'This field is an Open Vocabulary that specifies the type of indicator. Open vocab - indicator-type-ov'
    })

    t.string('name', {
      nullable: true,
      description: 'The name used to identify the Indicator.'
    })

    t.string('description', {
      nullable: true,
      description:
        'A description that provides the recipient with context about this Indicator\npotentially including its purpose and its key characteristics.'
    })

    t.string('pattern', {
      description: 'The detection pattern for this indicator.'
    })

    t.string('pattern_type', {
      description: 'The type of pattern used in this indicator.'
    })

    t.string('pattern_version', {
      nullable: true,
      description: 'The version of the pattern that is used.'
    })

    t.string('valid_from', {
      description:
        'The time from which this indicator should be considered valuable intelligence.'
    })

    t.string('valid_until', {
      nullable: true,
      description:
        'The time at which this indicator should no longer be considered valuable intelligence.'
    })
  }
})
