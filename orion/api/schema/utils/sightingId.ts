function getAlertIdBySightingId(id: string) {
  return parseInt(id.replace('sighting--', '').replace('sighting-', ''), 10)
}

function getSightingIdByAlertId(id: number) {
  return `sighting--${id}`
}

export { getAlertIdBySightingId, getSightingIdByAlertId }
