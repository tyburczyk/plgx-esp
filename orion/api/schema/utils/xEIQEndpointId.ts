function getXEIQEndpointIdByNodeHostId(id: string) {
  return `x-eiq-endpoint--${id}`
}

function getNodeHostIdByXEIQEndpointId(id: string) {
  return id.replace('x-eiq-endpoint--', '')
}

export { getXEIQEndpointIdByNodeHostId, getNodeHostIdByXEIQEndpointId }
