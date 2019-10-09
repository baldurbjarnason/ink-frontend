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
    content: "<blockquote>Test Quote</blockquote><p>test</p>",
    id: "https://example.com/test-id-for-note1",
    publication: list[0]
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 2</p>",
    id: "https://example.com/test-id-for-note",
    publication: list[0]
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 3</p>",
    id: "https://example.com/test-id-for-note3",
    publication: list[0]
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 4</p>",
    id: "https://example.com/test-id-for-note4",
    publication: list[0]
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 5</p>",
    id: "https://example.com/test-id-for-note5",
    publication: list[0]
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 6</p>",
    id: "https://example.com/test-id-for-note6",
    publication: list[0]
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 7</p>",
    id: "https://example.com/test-id-for-note",
    publication: list[0]
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
