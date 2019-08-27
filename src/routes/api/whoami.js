import got from "got";
export async function get(req, res, next) {
  const data = { user: req.user };
  if (req.user) {
    try {
      const response = await got.post(`${process.env.API_SERVER}whoami`, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      data.profile = response.body;
      console.log(response.body);
    } catch (err) {
      data.profile = {
        status: err.statusCode
      };
    }
  }
  req.session.profile = data.profile;
  return res.json(data);
}
