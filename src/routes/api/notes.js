import got from "got";
export async function get(req, res, next) {
  if (req.user) {
    const notesEndpoint = `${req.user.profile.id}/notes`;
    const { page, path } = req.query;
    try {
      const url = new URL(
        `${notesEndpoint}?limit=100&page=${page}&document=${path}`,
        process.env.API_SERVER
      );
      const response = await got.get(url.href, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      if (response.body.items) {
        response.body.items.sort(function (first, second) {
          const start = first.json.startLocation + new Date(first.updated).valueOf()
          const end = second.json.startLocation + new Date(second.updated).valueOf()
          return start.localeCompare(end);
        })
      }
      return res.json(response.body);
    } catch (err) {
      console.log(err);
      return res.sendStatus(err.statusCode || 500);
    }
  }
}
