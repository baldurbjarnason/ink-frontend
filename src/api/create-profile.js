import { fetchWrap, get } from "./fetch-wrap.js";

export async function create(session) {
  const newReader = {
    type: "Person",
    summary: `Reader profile`
  };
  try {
    const response = await fetchWrap(session.profile.create, {
      method: "POST",
      body: JSON.stringify(newReader),
      headers: new window.Headers({
        Authorization: `Bearer ${session.user.token}`,
        "content-type": "application/ld+json"
      })
    });
    const url = new URL(
      response.headers.get("location"),
      session.profile.create
    );
    const reader = await get(`/api/get?path=${url.pathname}`);
    return reader;
  } catch (err) {
    err.httpMethod = "POST/Create Profile";
    throw err;
  }
}
