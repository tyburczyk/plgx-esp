import { decode, verify } from 'jsonwebtoken'
import api from '../../polylogyx'

let token = ''

type PolylogyxJWT = {
  header: {
    alg: string
    iat: number
    exp: number
  }
  payload: {
    id?: number
  }
  signature: string
}

async function fetchAccessToken() {
  let result: { token: string } = await api
    .post('login', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'admin',
        username: 'admin',
      }),
    })
    .json()

  token = result.token

  return result
}

async function isTokenValid(token: string) {
  let decodedToken = decode(token, { complete: true }) as PolylogyxJWT

  let isValid = new Date(decodedToken.header.exp * 1000) > new Date()

  return isValid
}

async function getAccessToken(token: string) {
  if (!token || !(await isTokenValid(token))) {
    let { token } = await fetchAccessToken()

    return token
  }

  return token
}

// @HACK For now we can only authorize with plgx with a token like this.
// Ideally we would use a more secure solution like OpenID+ etc.
async function auth() {
  return {
    token: await getAccessToken(token),
  }
}

export default auth
