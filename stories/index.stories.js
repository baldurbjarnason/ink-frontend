import { storiesOf } from "@storybook/svelte";
// import { action } from "@storybook/addon-actions";

import Modal from "./Modal.svelte";
import LibraryItem from "./LibraryItem.svelte";
import LibraryList from "./LibraryList.svelte";
import NotesList from "./NotesList.svelte";
import Upload from "./Upload.svelte";
import UploadQueue from "./UploadQueue.svelte";
import Book from "./Book.svelte";
import Highlight from "./Highlight.svelte";
import chapter from "./preview-data/epub.html.json";

const list = [
  {
    name: "Book Title 1",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 2",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 3",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 4",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 5",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 6",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 7",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 8",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 9",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 10",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  }
];

const notes = [
  {
    content: "<blockquote>Test Quote</blockquote><p>Do you see any Teletubbies in here? Do you see a slender plastic tag clipped to my shirt with my name printed on it? Do you see a little Asian child with a blank expression on his face sitting outside on a mechanical helicopter that shakes when you put quarters in it? No? Well, that's what you see at a toy store. And you must think you're in a toy store, because you're here shopping for an infant named Jeb.</p>",
    id: "https://example.com/test-id-for-note1",
    'oa:hasSelector': {exact: "Do you see any Teletubbies in here? Do you see a slender plastic tag clipped to my shirt with my name printed on it? Do you see a little Asian child with a blank expression on his face sitting outside on a mechanical helicopter that shakes when you put quarters in it? No? Well, that's what you see at a toy store. And you must think you're in a toy store, because you're here shopping for an infant named Jeb."},
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 2</p>",
    id: "https://example.com/test-id-for-note",
    'oa:hasSelector': {exact: "This is a very long but exact quote that we need to do something with."},
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 3</p>",
    id: "https://example.com/test-id-for-note3",
    'oa:hasSelector': {exact: "This is a very long but exact quote that we need to do something with."},
    publication: list[0],
    json: {
      archived: true
    }
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 4</p>",
    id: "https://example.com/test-id-for-note4",
    'oa:hasSelector': {exact: "This is a very long but exact quote that we need to do something with."},
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 5</p>",
    id: "https://example.com/test-id-for-note5",
    'oa:hasSelector': {exact: "This is a very long but exact quote that we need to do something with."},
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 6</p>",
    id: "https://example.com/test-id-for-note6",
    'oa:hasSelector': {exact: "This is a very long but exact quote that we need to do something with."},
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 7</p>",
    id: "https://example.com/test-id-for-note",
    'oa:hasSelector': {exact: "This is a very long but exact quote that we need to do something with."},
    publication: list[0],
    json: {}
  }
];
storiesOf("Modal", module).add("with text", () => ({
  Component: Modal,
  props: { text: "Book First pass" }
}));
storiesOf("LibraryItem", module)
  .add("default cover", () => ({
    Component: LibraryItem,
    props: {
      book: {
        name: "Book Name",
        id: "https://localhost:4030/test-id/",
        author: [{ name: "Test Author" }]
      },
      layout: "covers"
    }
  }))
  .add("set cover", () => ({
    Component: LibraryItem,
    props: {
      book: {
        name: "Book Name",
        id: "https://localhost:4030/test-id/",
        author: [{ name: "Test Author" }],
        resources: [
          { rel: "cover", url: "https://localhost:3000/placeholder-cover.png" }
        ]
      },
      layout: "covers"
    }
  }));
storiesOf("LibraryList", module)
  .add("covers", () => ({
    Component: LibraryList,
    props: {
      list,
      layout: "covers"
    }
  }))
  .add("square", () => ({
    Component: LibraryList,
    props: {
      list,
      layout: "square"
    }
  }))
  .add("list", () => ({
    Component: LibraryList,
    props: {
      list,
      layout: "list"
    }
  }));

storiesOf("NotesList", module).add("covers", () => ({
  Component: NotesList,
  props: {
    notes,
    current: "https://example.com/test-id-for-note",
    layout: "covers"
  }
}));
storiesOf("Book", module).add("basic", () => ({
  Component: Book,
  props: {
    chapter
  }
}));
storiesOf("Highlight", module).add("basic", () => ({
  Component: Highlight,
  props: {
    chapter
  }
}));
storiesOf("Upload", module).add("main", () => ({
  Component: Upload,
  props: {}
}));
storiesOf("UploadQueue", module).add("basic timed queue display", () => ({
  Component: UploadQueue,
  props: {}
}));
