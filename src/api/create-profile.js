import {getToken} from './get-cookie.js'
import {fetchWrap, get} from './fetch-wrap.js'

    export async function create () {
      const newReader = {
        type: 'Person',
        summary: `Reader profile`
      }
      try {
        const csrfToken = getToken()
        const response = await fetchWrap(`${process.env.API_SERVER}readers`, {
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify(newReader),
          headers: new global.Headers({
            'content-type': 'application/ld+json',
            'csrf-token': csrfToken
          })
        })
        const reader = await get(
          response.headers.get('location'))
        return reader
      } catch (err) {
        err.httpMethod = 'POST/Create Profile'
        throw err
      }
    }