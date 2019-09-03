import got from "got";
import createDOMPurify from "dompurify/dist/purify.es.js";
import { JSDOM } from "jsdom";
import * as xml from 'xmlserializer'

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  ADD_ATTR: ['epub:type', 'xmlns:epub'],
  ADD_TAGS: ['link'],
  WHOLE_DOCUMENT: true
}

export async function get(req, res, next) {
  const {url} = req.params
  res.set('Cache-Control', 'max-age=31536000, immutable')
  if (req.user) {
    try {
      const response = await got.head(url, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        }
      });
      
      if (response.headers['content-type'].includes('svg')) {
        const mainresponse = await got(url, {
          headers: {
            Authorization: `Bearer ${req.user.token}`
          }
        })
        const dom = new JSDOM(mainresponse.body, {
          contentType: response.headers['content-type']
        })
        const window = dom.window
        const DOMPurify = createDOMPurify(window)
        const clean = DOMPurify.sanitize(
          window.document.documentElement,
          purifyConfig
        )
        const result = xml.serializeToString(clean)
        res.type('svg')
        res.send(result)
      } else if (response.headers['content-type'].includes('image') || response.headers['content-type'].includes('video')) {
        return got.stream(url, {
          headers: {
            Authorization: `Bearer ${req.user.token}`
          }
        }).pipe(res)
      } else {
        return res.sendStatus(404)
      }
    } catch (err) {
      return res.sendStatus(404);
    }
  }
}
