import getSTIXDeterministicUUID from './getSTIXDeterministicUUID'
import EclecticIQIdentity from '../EclecticIQIdentity'

const XDRIdentity: NexusGen['allTypes']['Identity'] = {
  id: getSTIXDeterministicUUID('identity', 'EIQ_XDR_POLYLOGYX'),
  confidence: 100,
  created: new Date().toISOString(),
  contact_information: '',
  created_by: EclecticIQIdentity,
  description: 'EclecticIQ Detection and Response Service',
  name: 'EclecticIQ XDR',
  identity_class: 'system'
}

export default XDRIdentity
