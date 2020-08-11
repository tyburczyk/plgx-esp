import { schema } from 'nexus'

schema.objectType({
  name: 'Ipv4Addr',
  description:
    'The IPv4 Address Object represents one or more IPv4 addresses expressed using CIDR notation.',
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
        'Specifies one or more IPv4 addresses expressed using CIDR notation.'
    })

    t.list.field('resolves_to', {
      type: 'MacAddr',
      nullable: true,
      description:
        'Specifies a list of references to one or more Layer 2 Media Access Control\n(MAC) addresses that the IPv4 address resolves to.'
    })

    t.list.field('belongs_to', {
      type: 'AutonomousSystem',
      nullable: true,
      description:
        'Specifies a reference to one or more autonomous systems (AS) that the IPv4 address belongs to.'
    })
  }
})
