import got from "got";
import slugify from "slugify";
import { normalise } from "../../api/normalise-publication.js";
// import * as fs from "fs";
export async function get(req, res, next) {
  if (req.user) {
    const { id } = req.query;
    try {
      const url = new URL(id, process.env.API_SERVER);
      const response = await got.get(url.href, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      const book = normalise(response.body);
      const notes = await Promise.all(book.readingOrder.map(getAndRenderNotes(req)))
      res.set('Content-Disposition', `attachment; filename="${slugify(book.name)}-notes.html"`)
      return res.send(renderHTML(notes.join('\n'), book));
    } catch (err) {
      console.log(err);
      return res.sendStatus(err.statusCode || 500);
    }
  }
}

function getAndRenderNotes (req) {
  return async function getAndRender (chapter, index) {
    const notesEndpoint = `${req.user.profile.id}/notes`;
    const url = new URL(
      `${notesEndpoint}?limit=100&document=${chapter.url}`,
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
    let chapterTitle
    if (response.body.items[0] && response.body.items[0].json && response.body.items[0].json.chapterTitle) {
      chapterTitle = response.body.items[0].json.chapterTitle
    } else {
      chapterTitle = `Chapter ${index + 1}`
    }
    return renderNotes(response.body, chapterTitle)
  }
}

function renderNotes ({items}, chapter = "") {
  const htmlNotes = items.map(item => {
    return `<div class="Note">${item.content}
    <div class="Comment">${item.json.comment || ""}</div>
  </div>`
  })
  if (items.length > 0) {
    return `
    <div class="Chapter">
      ${chapter ? `<h2>${chapter}</h2>` : ""}
      ${htmlNotes.join('\n')}
    </div>
    `
  } else {
    return ''
  }
}

function renderHTML  (notes, book) {
  return `<!doctype html>
  <html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1.0'>
    <title>Notes for ${book.name}</title>
  </head>
  <body id="body">
  <h1>Notes for ${book.name}</h1>
  ${notes}
  </body>
  </html>
  `
}
