<script>
  import { decode, encode } from "universal-base64url";
  import WithSidebars from "../components/WithSidebars.svelte";
  import { stores as inkStores } from "../stores";
  import Modals from './Modals.svelte'
  import Sidebar from './Sidebar.svelte'
  import { opener, closer } from "../actions/modal.js";
  import { stores, goto } from "@sapper/app";
  const { page, session } = stores();
  const { title, infoBook, currentInfoBook, note } = inkStores();
  let query = {};
  let leftSidebar;
  let rightSidebar;
  let params = {};
  let collection = "all";
  let history
  let firstRun = true;
  $: if ($page) {
    query = $page.query;
    params = $page.params;
    if (!firstRun && !query.noHistory) {
      history = true
    } else {
      firstRun = false
    }
    if (params.infoBook) {
      leftSidebar = "item";
    } else if (params.path) {
      leftSidebar = "contents";
    } else {
      leftSidebar = "collections";
    }
    if (params.collection) {
      collection = params.collection[0];
    }
    if (query.item) {
      infoBook.set({ id: decode(query.item) });
      currentInfoBook.set("");
      rightSidebar = "item";
    } else if (query.upload) {
      rightSidebar = "upload";
    } else if (query.note) {
      note.set({ id: decode(query.note) });
      rightSidebar = "note";
    } else if (query.chapternotes) {
      rightSidebar = "chapternotes";
    } else if (query.booknote) {
      rightSidebar = "booknote";
    } else if (query.chapter) {
      rightSidebar = "chapter";
    } else if (query.webpage) {
      rightSidebar = "webpage";
    } else if (query.addbooks) {
      rightSidebar = "addbooks";
    } else if (params.collection) {
      rightSidebar = "upload";
    } else if ($page.path === "/") {
      rightSidebar = "upload";
    }
  }
  $: if (width <= 1024 && rightSidebar && query[rightSidebar]) {
    opener({ id: rightSidebar + "-modal" });
  } else {
    closer();
  }
  $: if ($session) {
    console.log($session);
  }
  let width;
</script>

<style>
  main {
    position: relative;
    padding: 0;
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 100vh;
  }
</style>

<svelte:window bind:innerWidth={width} />
<Modals {leftSidebar} {rightSidebar} {collection} />
<main>
  <WithSidebars
    title={$title}
    leftModal={leftSidebar + '-modal'}
    rightModal={rightSidebar + '-modal'}
    rightLabel={rightSidebar}>
    <div slot="left-sidebar">
      <Sidebar sidebar={leftSidebar} {collection} history={false} />
    </div>
    <slot />
    <div slot="right-sidebar">
      <Sidebar sidebar={rightSidebar} {collection} {history} />
    </div>
  </WithSidebars>
</main>
