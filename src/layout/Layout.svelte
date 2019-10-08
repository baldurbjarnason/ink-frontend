<script>
  import { decode, encode } from "universal-base64url";
  import WithSidebars from "../components/WithSidebars.svelte";
  import { stores as inkStores } from "../stores";
  import Collections from "../collections/Collections.svelte";
  import InfoActions from "../components/InfoActions.svelte";
  import { stores, goto } from "@sapper/app";
  const { page, session } = stores();
  const { title, infoBook, currentInfoBook } = inkStores();
  let query = {};
  let leftSidebar;
  let rightSidebar;
  let params = [];
  $: if ($page) {
    query = $page.query;
    params = $page.query;
    if (params.infoBook) {
      leftSidebar = "item";
    } else {
      leftSidebar = "collections";
    }
    if (query.book) {
      infoBook.set({ id: decode(query.book) });
      currentInfoBook.set("");
      rightSidebar = "item";
    } else if (query.upload) {
      rightSidebar = "upload";
    } else if (query.comment) {
      rightSidebar = "comment";
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
    }
  }
  $: if ($session) {
    console.log($session);
  }
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

<main>
  <WithSidebars
    title={$title}
    leftModal={leftSidebar + '-modal'}
    rightModal={rightSidebar + '-modal'}>
    <div slot="left-sidebar">
      {#if leftSidebar === 'item'}
        <InfoActions modal={false} sidebar={true} />
      {:else}
        <Collections />
      {/if}
    </div>
    <slot />
    <div slot="right-sidebar">
      {#if rightSidebar === 'item'}
        <InfoActions modal={false} sidebar={true} />
      {/if}
    </div>
  </WithSidebars>
</main>
