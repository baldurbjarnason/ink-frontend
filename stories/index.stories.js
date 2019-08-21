import { storiesOf } from "@storybook/svelte";
import { action } from "@storybook/addon-actions";

import Modal from "./Modal.svelte";

storiesOf("Book", module).add("with text", () => ({
  Component: Modal,
  props: { text: "Book First pass" }
}));
