import { getter } from "../../api/fetch.js";
import { cleanCSS } from "../../api/clean-css.js";

export async function get(req, res, next) {
  const fetch = getter(req, res);
  const file = req.query.css;
  const url = new URL(file, "http://example.com/");
  try {
    const response = await fetch(file);
    const body = await response.text();
    const style = await cleanCSS(
      body,
      url.hostname === "example.com" ? url.pathname : file
    );
    res.set("Content-Type", "text/css");
    return res.send(style);
  } catch (err) {
    next(err);
  }
}
