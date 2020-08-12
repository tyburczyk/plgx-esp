import { v5 as uuidv5 } from 'uuid'

const NAMESPACE_UUID = 'a505a43c-5101-49aa-a3dd-9da687fb27a7'

function getSTIXDeterministicUUID(type: string, seed: string) {
  let deterministicUUID = uuidv5(`${seed}`, NAMESPACE_UUID)

  return `${type}--${deterministicUUID}`
}

export default getSTIXDeterministicUUID
