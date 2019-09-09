import got from "got";
import {normalise} from '../../api/normalise-publication.js'
export async function get(req, res, next) {
  const {page = 1, collection} = req.query
  if (req.user && req.session.profile && req.session.profile.id) {
    try {
      let url
      if (collection === 'all') {
        url = `${req.session.profile.id}/library?limit=100&page=${page}`
      } else {
        url = `${req.session.profile.id}/library?limit=100&stack=${encodeURIComponent(collection)}&page=${page}`
      }
      const response = await got(url, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      response.body.items = response.body.items.map(normalise)
      return res.json(response.body);
    } catch (err) {
      res.status(500)
      console.error('in collection: ', err)
      res.json(err)
    }
  } else {
    res.sendStatus(404)
  }
}
