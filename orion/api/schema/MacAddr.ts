import { schema } from 'nexus'

schema.objectType({
  name: 'MacAddr',
  description:
    'The MAC Address Object represents a single Media Access Control (MAC) address.',
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

    t.string('value', {
      description:
        'Specifies one or more mac addresses expressed using CIDR notation.'
    })
  }
})
