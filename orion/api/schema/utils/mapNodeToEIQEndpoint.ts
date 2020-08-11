import formatBytes from './formatBytes'
import EclecticIQIdentity from '../EclecticIQIdentity'
import { version as getIPVersion } from 'is-ip'
import getSTIXDeterministicUUID from './getSTIXDeterministicUUID'

type Modify<T, R> = Omit<T, keyof R> & R

type NodeOSInfo = {
  name?: string
  build?: string
  platform?: string
  platform_like?: string
  codename?: string
  major?: string
  minor?: string
  patch?: string
  version?: string
}

type NodeInfo = {
  cpu_type?: string
  cpu_physical_cores?: string
  physical_memory?: number
  hardware_vendor?: string
  hardware_serial?: string
  hardware_model?: string
  computer_name?: string
}

type NetworkInfo = {
  mac: string
  mask: string
  address: string
  enabled: string
  description: string
  manufacturer: string
  connection_id: string
  connection_status: string
}

type Node = Modify<
  NexusPrismaGen['models']['node'],
  {
    node_info: NodeInfo
    network_info: NetworkInfo[]
    os_info: NodeOSInfo
  }
>

type IpAddress = NexusGen['rootTypes']['IpAddr']

function getNodeStatus(isActive: boolean): 'active' | 'inactive' {
  return isActive ? 'active' : 'inactive'
}

function mapNodeNetworkInfoToIPAddresses(
  networkInfo: NetworkInfo[]
): IpAddress[] {
  return networkInfo.map((network) => {
    let addressVersion = getIPVersion(network.address)
    let stixType = `ipv${addressVersion}-addr`

    return {
      id: getSTIXDeterministicUUID(stixType, network.address),
      value: network.address
    }
  })
}

function mapNodeToEIQEndpoint(node: Node) {
  let endpoint = {
    __typename: 'XEIQEndpoint',
    id: `x-eiq-endpoint--${node.host_identifier}`,
    createdBy: EclecticIQIdentity,
    description: node.os_info?.name,
    name: node.node_info.computer_name,
    spec_version: '2.1',
    identity_class: 'system',
    type: 'identity',
    created: new Date(node.enrolled_on || '').toISOString(),
    modified: new Date(node.last_checkin || '').toISOString(),
    revoked: !node.is_active,
    contact_information: '',
    lang: 'en',
    aliases: [node.node_info.computer_name],
    ip_addresses: mapNodeNetworkInfoToIPAddresses(node.network_info),
    endpoint_status: getNodeStatus(node.is_active),
    operating_system: {
      name: node.os_info?.name,
      build: node.os_info.build,
      platform: node.os_info.platform,
      platform_like: node.os_info.platform_like,
      codename: node.os_info.codename,
      version: {
        major: node.os_info.major,
        minor: node.os_info.minor,
        patch: node.os_info.patch,
        version: node.os_info.version
      }
    },
    last_checkin: new Date(node.last_checkin || '').toISOString(),
    host_identifier: node.host_identifier,
    system: {
      cpu: {
        type: node.node_info.cpu_type,
        physical_cores: node.node_info.cpu_physical_cores
      },
      physical_memory: formatBytes(node.node_info.physical_memory || 0),
      hardware: {
        vendor: node.node_info.hardware_vendor,
        serial: node.node_info.hardware_serial,
        model: node.node_info.hardware_model
      }
    }
  }

  return endpoint
}

export { Node, NodeInfo, Modify, NodeOSInfo, NetworkInfo }

export default mapNodeToEIQEndpoint
