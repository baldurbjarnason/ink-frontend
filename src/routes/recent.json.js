import got from "got";
export async function get(req, res, next) {
  if (req.user && req.session.profile) {
    try {
      const response = await got(`${req.session.profile.id}/library?limit=10`, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      return res.json(response.body);
    } catch (err) {
      res.status(500)
      console.error(err)
      res.json(err)
    }
  }
}
