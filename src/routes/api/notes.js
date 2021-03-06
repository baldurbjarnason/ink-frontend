import got from "got";
import querystring from "querystring";
export async function get(req, res, next) {
  if (req.user) {
    const notesEndpoint = `${req.user.profile.id}/notes`;
    const { page, path } = req.query;
    const query = {
      page,
      document: path
    }
    try {
      const url = new URL(
        `${notesEndpoint}?${querystring.stringify(query)}`,
        process.env.API_SERVER
      );
      const response = await got.get(url.href, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      if (response.body.items) {
        response.body.items.sort(function(first, second) {
          const start = first.json.startLocation;
          const end = second.json.startLocation;
          if (
            start === end &&
            first.json.startLocation &&
            second.json.startLocation
          ) {
            return (
              parseInt(first.json.startOffset, 10) -
              parseInt(second.json.startOffset, 10)
            );
          } else {
            return start.localeCompare(end);
          }
        });
      }
      return res.json(response.body);
    } catch (err) {
      console.log(err);
      return res.sendStatus(err.statusCode || 500);
    }
  }
}
