import { schema } from 'nexus'

schema.objectType({
  name: 'Identity',
  description:
    'Identities can represent actual individuals, organizations, or groups (e.g.,\nACME, Inc.) as well as classes of individuals, organizations, or groups.',
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

    t.list.string('roles', {
      nullable: true,
      description:
        'The list of roles that this Identity performs (e.g., CEO, Domain\nAdministrators, Doctors, Hospital, or Retailer). No open vocabulary is yet\ndefined for this property.'
    })

    t.string('name', { description: 'The name of this Identity.' })

    t.string('description', {
      nullable: true,
      description:
        'A description that provides more details and context about the Identity.'
    })

    t.string('identity_class', {
      description:
        'The type of entity that this Identity describes, e.g., an individual or organization. Open Vocab - identity-class-ov'
    })

    t.list.string('sectors', {
      nullable: true,
      description:
        'The list of sectors that this Identity belongs to. Open Vocab - industry-sector-ov'
    })

    t.string('contact_information', {
      nullable: true,
      description:
        'The contact information (e-mail, phone number, etc.) for this Identity.'
    })
  }
})
