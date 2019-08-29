import { storiesOf } from "@storybook/svelte";
// import { action } from "@storybook/addon-actions";

import Modal from "./Modal.svelte";
import LibraryItem from "./LibraryItem.svelte";
import LibraryList from "./LibraryList.svelte";
import Upload from "./Upload.svelte";

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

storiesOf("Upload", module).add("main", () => ({
  Component: Upload,
  props: {}
}));
