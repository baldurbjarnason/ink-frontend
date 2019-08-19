// import * as fs from "fs";
import { parseToC } from "../../api/toc-to-json.js";
import { getter } from "../../api/fetch.js";

export async function get(req, res, next) {
  const fetch = getter(req, res);
  // Should use getter to always fetch, no url wrangling
  const file = req.query.toc;
  const url = new URL(file, "http://example.com/");
  const response = await fetch(file);
  const body = await response.text();
  try {
    const toc = parseToC(
      body,
      url.hostname === "example.com" ? url.pathname : file
    );
    // await fs.promises.writeFile(
    //   "toc.json",
    //   JSON.stringify(toc, null, 2)
    // );
    return res.json(toc);
  } catch (err) {
    next(err);
  }
}
