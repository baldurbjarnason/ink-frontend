import { storiesOf } from "@storybook/svelte";
import { action } from "@storybook/addon-actions";

import Modal from "./Modal.svelte";
import LibraryItem from "./LibraryItem.svelte";

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
