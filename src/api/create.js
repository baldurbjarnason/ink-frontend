import { fetchWrap, get } from "./fetch-wrap.js";

export async function create(payload) {
  const profile = window._session.profile
  const user = window._session.user
  try {
    const response = await fetchWrap(profile.create, {
      method: "POST",
      body: JSON.stringify({
        "@context": [
          "https://www.w3.org/ns/activitystreams",
          { reader: "https://rebus.foundation/ns/reader" }
        ],
        type: "Create",
        object: payload
      }),
      headers: new window.Headers({
        Authorization: `Bearer ${user.token}`,
        "content-type": "application/ld+json"
      })
    });
    const url = new URL(response.headers.get("location"), profile.create);
    const reader = await get(
      `/api/get?path=${encodeURIComponent(url.pathname)}`
    );
    return reader;
  } catch (err) {
    err.httpMethod = "POST/Create Profile";
    throw err;
  }
}
