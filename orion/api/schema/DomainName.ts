import { schema } from 'nexus'

schema.unionType({
  name: 'DomainNameResolvesTo',
  definition(t) {
    t.members('DomainName', 'Ipv4Addr', 'Ipv6Addr')
    t.resolveType(({ id }) => {
      if (id?.includes('ipv4')) {
        return 'Ipv4Addr'
      } else if (id?.includes('ipv6')) {
        return 'Ipv6Addr'
      } else {
        return 'DomainName'
      }
    })
  }
})

schema.objectType({
  name: 'DomainName',
  description:
    'The Domain Name represents the properties of a network domain name.',
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
      description: 'Specifies the value of the domain name.'
    })

    t.list.field('resolves_to', {
      type: 'DomainNameResolvesTo',
      nullable: true,
      description:
        'Specifies a list of references to one or more IP addresses or domain names that the domain name resolves to.'
    })
  }
})
