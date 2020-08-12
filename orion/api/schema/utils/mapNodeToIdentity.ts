
function mapNodeToIdentity(node: any) {
  let identity = {
    __typename: 'Identity',
    id: `identity--${node.host_identifier}`,
    confidence: 100,
    description: node?.os_info?.name,
    name: node.host_identifier,
    spec_version: '2.1',
    identity_class: 'system',
    type: 'identity',
    created: new Date(node.enrolled_on).toISOString(),
    modified: new Date(node.last_checkin).toISOString(),
    revoked: !node.is_active,
    contact_information: '@TODO',
    lang: 'en',
    sectors: ['@TODO'],
    x_polylogyx_node_os_info: node.os_info,
    x_polylogyx_node_info: node.node_info,
    x_polylogyx_node_is_active: node.is_active,
    x_polylogyx_network_info: node.network_info,
  }

  return identity
}

export default mapNodeToIdentity
