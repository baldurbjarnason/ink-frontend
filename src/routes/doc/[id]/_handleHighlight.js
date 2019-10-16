import textQuote from "dom-anchor-text-quote";
import seek from "dom-seek";
import { create } from "../../../api/create.js";
import { encode } from "universal-base64url";
import { goto } from "@sapper/app";

export function handleHighlight(range, root, chapter) {
  if (range && root) {
    const selector = textQuote.fromRange(root, range);
    let startLocation;
    if (range.startContainer.nodeType === window.Node.TEXT_NODE) {
      startLocation = range.startContainer.parentElement.closest(
        "[data-location]"
      ).dataset.location;
    } else {
      startLocation = range.startContainer.closest("[data-location]").dataset
        .location;
    }
    let endLocation;
    if (range.endContainer.nodeType === window.Node.TEXT_NODE) {
      endLocation = range.endContainer.parentElement.closest("[data-location]")
        .dataset.location;
    } else {
      endLocation = range.endContainer.closest("[data-location]").dataset
        .location;
    }
    const html = serializeRange(range);
    let content = `<blockquote data-original-quote>${html}</blockquote>`;
    const contentRange = document.createRange();
    const note = {
      type: "Note",
      noteType: "reader:Highlight",
      inReplyTo: chapter.url,
      "oa:hasSelector": selector,
      json: {
        startLocation,
        endLocation
      },
      content
    };
    try {
      contentRange.setStartBefore(
        document.querySelector(`[data-location=${startLocation}]`)
      );
      contentRange.setEndAfter(
        document.querySelector(`[data-location=${endLocation}]`)
      );
      const html = serializeRange(contentRange, note);
      content = `<blockquote data-original-quote>${html}</blockquote>`;
    } catch (err) {}
    const tempId = "temp-" + Math.floor(Math.random() * 10000000000000);
    highlightNote(selector, root, tempId, note);
    console.log(`${startLocation}–${endLocation}`);
    document.getSelection().collapse(root, 0);
    return create(note).then(activity => {
      document.querySelectorAll(`[data-note-id="${tempId}"]`).forEach(node => {
        node.dataset.noteId = activity.object.id;
        node.href = setNoteURL(activity.object.id);
      });
    });
  }
}

function highlightNote(selector, root, id, note, mark) {
  const seeker = document.createNodeIterator(root, window.NodeFilter.SHOW_TEXT);
  function split(where) {
    const count = seek(seeker, where);
    if (count !== where) {
      // Split the text at the offset
      seeker.referenceNode.splitText(where - count);

      // Seek to the exact offset.
      seek(seeker, where - count);
    }
    return seeker.referenceNode;
  }
  const positions = textQuote.toTextPosition(root, selector);
  const start = split(positions.start);
  split(positions.end - positions.start);
  var nodes = [];
  while (seeker.referenceNode !== start) {
    const node = seeker.previousNode();
    if (node !== start) {
      nodes.push(node);
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (
      node.parentElement.closest(".BookBody") &&
      !node.parentElement.closest("[data-annotation-tool]") &&
      !node.parentElement.closest("a.Highlight")
    ) {
      // Create a highlight
      const highlight = mark
        ? document.createElement("mark")
        : document.createElement("a");
      highlight.dataset.noteId = id;
      highlight.classList.add("Highlight");
      if (note.json.commented) {
        highlight.classList.add("Commented");
      }
      highlight.dataset.highlightLevel = 0;
      highlight.root = root;
      highlight.href = setNoteURL(id);
      // Wrap it around the text node
      node.parentNode.replaceChild(highlight, node);
      highlight.appendChild(node);
    } else if (node.parentElement.closest("a.Highlight")) {
      // Create a highlight but a mark this time
      const highlight = document.createElement("mark");
      highlight.dataset.noteId = id;
      highlight.classList.add("Highlight");
      if (note.json.commented) {
        highlight.classList.add("Commented");
      }
      highlight.dataset.highlightLevel = highlight.dataset.highlightLevel + 1;
      highlight.root = root;
      highlight.dataset.href = setNoteURL(id);
      highlight.addEventListener(event => {
        event.preventDefault();
        event.stopPropagation();
        return goto(highlight.dataset.href);
      });
      highlight.setAttribute("sapper-noscroll", "true");
      // Wrap it around the text node
      node.parentNode.replaceChild(highlight, node);
      highlight.appendChild(node);
    }
  }
}

function setNoteURL(id) {
  const search = new window.URLSearchParams(window.location.search);
  search.set("note", encode(id));
  const url = new window.URL(window.location);
  url.search = search.toString();
  return url.href;
}

export function highlightNotes(root, annotations) {
  for (const note of annotations.items) {
    if (note.selector && !note.json.archived) {
      highlightNote(note.selector, root, note.id, note);
    }
  }
}

// function getFragment (range) {
//   const fragment = range.cloneContents();
//   return fragment;
// }

// function serializeFragment (fragment) {
//   fragment.querySelectorAll("[data-reader]").forEach(element => {
//     element.parentElement.removeChild(element);
//   });
//   fragment.querySelectorAll("a.Highlight").forEach(element => {
//     element.replaceWith(element.textContent);
//   });
//   fragment
//     .querySelectorAll("[style]")
//     .forEach(element => element.removeAttribute("style"));
//   const placeholder = document.createElement("div");
//   placeholder.appendChild(fragment);
//   return placeholder.innerHTML;
// }

function serializeRange(range, note) {
  const placeholder = document.createElement("div");
  const fragment = range.cloneContents();
  fragment.querySelectorAll("[data-reader]").forEach(element => {
    element.parentElement.removeChild(element);
  });
  fragment.querySelectorAll("a.Highlight").forEach(element => {
    element.replaceWith(element.textContent);
  });
  fragment
    .querySelectorAll("[style]")
    .forEach(element => element.removeAttribute("style"));
  placeholder.appendChild(fragment);
  if (note) {
    highlightNote(note["oa:hasSelector"], placeholder, note.id, note.mark);
  }
  return placeholder.innerHTML;
}
