import got from "got";
import slugify from "slugify";
import { normalise } from "../../api/normalise-publication.js";
import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';
const turndownService = new TurndownService({headingStyle: "atx"});
turndownService.use(gfm)
turndownService.remove('title')
turndownService.keep(['svg', 'math'])
// import * as fs from "fs";
export async function get(req, res, next) {
  if (req.user) {
    const { id, collection, markdown } = req.query;
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
      const html = renderHTML(notes.join('\n'), book, collection)
      if (!markdown) {
        res.set('Content-Disposition', `attachment; filename="${slugify(book.name)}-notes.html"`)
        return res.send(html);
      } else {
        res.type('text/plain')
        res.set('Content-Disposition', `attachment; filename="${slugify(book.name)}-notes.md"`)
        return res.send(turndownService.turndown(html));
      }
    } catch (err) {
      console.log(err);
      return res.sendStatus(err.statusCode || 500);
    }
  }
}

function getAndRenderNotes (req) {
  return async function getAndRender (chapter, index) {
    const {collection} = req.query
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
    if (collection && collection !== "all") {
      response.body.items = response.body.items.filter(item => item.json.collection === collection)
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

function renderHTML  (notes, book, collection) {
  return `<!doctype html>
  <html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1.0'>
    <title>Notes for ${book.name} ${collection ? `in <em>${collection}</em>` : "" }</title>

    <style>
    
  .Chapter > * {
    grid-column: 2 / 3;
    margin: 0 auto;
    max-width: 100%;
  }
  .Bookmarked {
    position: relative;
  }
  .Bookmarked::after {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -50vw;
    display: block;
    top: 0;
    height: 2.5rem;
    border-left: 0.75rem solid #b4312e;
    border-bottom: 0.75rem solid transparent;
  }
  /* .Highlight.Commented::after {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -50vw;
    display: block;
    top: 0;
    height: 1.25rem;
    border-left: 1.25rem solid #b4312e;
  } */

  .Chapter .Highlight {
    background-color: #ffff98;
  }

  .Chapter .Highlight--selected {
    background-color: #ddddd0;
  }

  .Chapter [hidden],
  .Chapter template {
    display: none !important;
  }
  .Chapter head {
    display: none;
  }

  .Chapter blockquote {
    padding-left: 2.5em;
    margin-left: 0;
  }

  .Chapter blockquote,
  .Chapter blockquote p {
    font-size: 0.75rem;
    font-size: calc(var(--reader-font-size) * 0.85);
    line-height: 1.45;
  }

  .Chapter blockquote * + * {
    margin-top: calc(var(--reader-paragraph-spacing) * 0.85);
  }
  .Chapter blockquote * {
    margin-bottom: 0;
  }
  .Chapter blockquote :first-child {
    margin: 0;
  }
  .Chapter h1 {
    font-size: 2em;
    font-size: calc(var(--reader-font-size) * 3);
    font-weight: 600;
    margin: 0;
  }

  .Chapter h2 {
    font-weight: 600;
    font-size: calc(var(--reader-font-size) * 2);
    margin: 0;
  }
  .Chapter h3 {
    font-weight: 400;
    font-style: italic;
    font-size: calc(var(--reader-font-size) * 1.5);
    margin: 0;
  }
  .Chapter h4 {
    font-weight: normal;
    font-size: calc(var(--reader-font-size) * 1.25);
    margin: 0;
  }
  .Chapter h5 {
    font-weight: normal;
    font-size: var(--reader-font-size);
    text-transform: uppercase;
    margin: 0;
  }

  .Chapter h6 {
    font-weight: normal;
    font-size: var(--reader-font-size);
    margin: 0;
  }

  .Chapter h1,
  .Chapter h2,
  .Chapter h3,
  .Chapter h4,
  .Chapter h5,
  .Chapter h6 {
    margin: 0;
  }

  .Chapter p,
  .Chapter td,
  .Chapter figure,
  .Chapter figcaption {
    line-height: var(--reader-line-height);
    font-size: 0.85rem;
    font-size: var(--reader-font-size, 0.85rem);
  }

  .Chapter a[href] {
    transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
      transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
    text-decoration: underline;
  }
  .Chapter :link {
    color: var(--link);
  }
  .Chapter :visited {
    color: var(--visited);
  }
  .Chapter a:link:hover {
    color: var(--hover);
  }
  .Chapter a {
    border-radius: 0;
  }
  @keyframes readableChapterPop {
    0% {
      box-shadow: 0 0 0 1px rgb(228, 255, 254, 0.2);
      background-color: rgb(228, 255, 254, 0.2);
      transform: scale(0.5);
    }
    50% {
      box-shadow: 0 0 0 8px var(--rc-lighter);
      transform: scale(1.5);
    }
    100% {
      box-shadow: 0 0 0 3px var(--rc-lighter);
      background-color: var(--rc-lighter);
      transform: scale(1);
    }
  }
  .Highlight.Commented {
    position: relative;
    border-bottom: 0.125rem solid #eded00;
  }
  .Chapter a.Highlight, .Chapter mark.Highlight {
    background-color: #feff9c;
    color: var(--reader-text-color);
    text-decoration: none;
    border-radius: 0;
    position: relative;
  }
  .Chapter .Highlight[data-highlight-label="question"] {
    background-color: var(--rc-lighter);
  }
  .Chapter mark.Highlight[data-highlight-level="1"] {
    background-color: #7afcff;
  }
  .Chapter mark.Highlight[data-highlight-level="2"] {
    background-color: #ff65a3;
  }
  .Chapter mark.Highlight[data-highlight-level="3"] {
    background-color: #fff740;
  }
  .Chapter a.Highlight:hover {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 3px var(--rc-lighter);
    color: var(--reader-text-color);
    text-decoration: none;
    border-radius: 0;
    cursor: pointer;
  }
  /* .Chapter mark.Highlight[data-highlight-level="1"]:hover {
    background-color: var(--rc-light);
    box-shadow: 0 0 0 3px var(--rc-light);
  }
  .Chapter mark.Highlight[data-highlight-level="2"]:hover {
    background-color: #ff7eb9;
    box-shadow: 0 0 0 3px #ff7eb9;
  }
  .Chapter mark.Highlight[data-highlight-level="3"]:hover {
    background-color: #feff9c;
    box-shadow: 0 0 0 3px #feff9c;
  } */
  .Highlight-anchor {
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
    top: -40px;
    left: 0;
  }
  .Chapter .Highlight-return-link {
    line-height: 16px;
    height: 20px;
    width: 20px;
    border-radius: 20px;
    padding-top: 2px;
    display: inline-block;
    padding: 2px 0 0 0;
    margin: 0;
    vertical-align: middle;
    text-align: center;
    background-color: #f7f7f7;
  }
  .Chapter mark::before, 
  .Chapter mark::after, .Chapter a.Highlight::before, 
  .Chapter a.Highlight::after {
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .Chapter mark::before, .Chapter a.Highlight::before {
    content: " [highlight start] ";
  }

  .Chapter mark::after, .Chapter a.Highlight::after {
    content: " [highlight end] ";
  }
  .Chapter a:focus {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 5px var(--rc-lighter);
    outline: solid transparent;
    animation: readableChapterPop 0.25s ease-in-out;
  }

  .Chapter a:link:active {
    color: var(--active);
  }
  .Chapter b,
  .Chapter strong,
  .Chapter b > *,
  .Chapter strong > * {
    font-weight: 600;
  }
  .Chapter svg,
  .Chapter img {
    max-height: 88vh;
    width: auto;
    height: auto;
    max-width: 100%;
  }
  .Chapter .is-current {
    background-color: #f9f9f9;
    box-shadow: 0 0 0 0.25rem #f9f9f9;
  }
  p, ol, ul, dl, blockquote, figure, table, hr, section, article, details, figcaption {
    margin-top: var(--reader-paragraph-spacing);
    margin-bottom: var(--reader-paragraph-spacing);
  }
  body {
  	display: grid;
	grid-template-columns: 0.5fr 1fr 0.5fr;
	font-size: 110%;
	}
body > * {
grid-column: 2 / 3;
}
.Note {
	background-color: #fefefe;
	padding: 1rem 0.5rem;
	margin-bottom: 1rem;
    z-index: 1;
    position: relative;
    box-shadow: 0px 0px 2px 0px rgba(33, 33, 33, 0.1), 1px 1px 3px 0px rgba(133, 133, 133, 0.1);
}

.Comment {
	display: block;
	font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantrell, "Helvetica Neue", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 1rem;
    margin: 1rem 0;
    padding: 0.5rem 1.5rem;
    z-index: 1;
	}
	.Comment > p {
    font-size: 1rem;
	
    }
    .Chapter h2 {
    margin: 1rem 0;
    font-size: 2rem;
    text-transform: uppercase;
    font-weight: normal;
    }
     h1 {
    margin: 3rem 0;
    font-size: 4rem;
    font-style: italic;
    font-weight: normal;
    }
    </style>
  </head>
  <body id="body">
  <h1>Notes for ${book.name} ${collection ? `in <em>${collection}</em>` : "" }</h1>
  ${notes}
  </body>
  </html>
  `
}
