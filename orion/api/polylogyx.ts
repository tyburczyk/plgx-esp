import got from 'got'

const POLYLOGYX_API_URL = 'https://127.0.0.1:5000/services/api/v0'

let api = got.extend({
  prefixUrl: POLYLOGYX_API_URL,
  https: {
    rejectUnauthorized: false,
  },
})

export default api
