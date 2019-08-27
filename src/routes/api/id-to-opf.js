// import * as fs from "fs";
import { parseOPF } from "../../api/opf-to-metadata.js";
import { getter } from "../../api/fetch.js";

export async function get(req, res, next) {
  const fetch = getter(req, res);
  // Should use getter to always fetch, no url wrangling
  const file = req.query.id;
  try {
    const idResponse = await fetch(file);
    const book = await idResponse.json();
    const opf = book.resources.find(
      item => item.encodingFormat === "application/oebps-package+xml"
    );
    const response = await fetch(opf.url);
    const body = await response.text();
    const url = new URL(opf.url, "http://example.com/");
    const metadata = parseOPF(
      body,
      url.hostname === "example.com" ? url.pathname : file
    );
    // if (file.includes('pg55456-images')) {
    //   await fs.promises.writeFile(
    //     "book2.json",
    //     JSON.stringify(metadata, null, 2)
    //   );
    // }
    return res.json(metadata);
  } catch (err) {
    next(err);
  }
}
