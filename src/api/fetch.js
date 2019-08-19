// This is based on the fetch code from sapper
// https://github.com/sveltejs/sapper/blob/a52bdb2f4e1a722f06134b4065da2a32969e12e2/runtime/src/server/middleware/get_page_handler.ts
// MIT Licensed

import cookie from "cookie";
import fetch from "node-fetch";

export function getter(req, res) {
  return function serverFetch(url, opts) {
    const parsed = new URL(
      url,
      `http://127.0.0.1:${process.env.PORT}${
        req.baseUrl ? req.baseUrl + "/" : ""
      }`
    );

    if (opts) {
      opts = Object.assign({}, opts);

      const includeCookies =
        opts.credentials === "include" ||
        (opts.credentials === "same-origin" &&
          parsed.origin === `http://127.0.0.1:${process.env.PORT}`);

      if (includeCookies) {
        opts.headers = Object.assign({}, opts.headers);

        const cookies = Object.assign(
          {},
          cookie.parse(req.headers.cookie || ""),
          cookie.parse(opts.headers.cookie || "")
        );

        const setCookie = res.getHeader("Set-Cookie");
        (Array.isArray(setCookie) ? setCookie : [setCookie]).forEach(str => {
          const match = /([^=]+)=([^;]+)/.exec(str);
          if (match) cookies[match[1]] = match[2];
        });

        const str = Object.keys(cookies)
          .map(key => `${key}=${cookies[key]}`)
          .join("; ");

        opts.headers.cookie = str;
      }
    }

    return fetch(parsed.href, opts);
  };
}
