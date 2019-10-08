<script>
  import { decode, encode } from "universal-base64url";
  import WithSidebars from "../components/WithSidebars.svelte"
  import {title, leftSidebar, rightSidebar} from "../stores/layout.js"
  import Collections from "../collections/Collections.svelte"
  import InfoActions from "../components/InfoActions.svelte"
  import { infoBook as book, currentInfoBook as current } from "../stores/book.js";
  import { stores, goto } from "@sapper/app";
  const { page, session } = stores();
  let query = {}
  $: if ($page) {
    query = $page.query
  }
  $: if (query.book) {
    book.set()
    book.set({ id: decode(query.book) });
    current.set('');
  }
  $: if ($session) {
    console.log($session)
  }
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<WithSidebars title={$title} leftModal={$leftSidebar + '-modal'} rightModal={$rightSidebar + "-modal"}>
  <div slot="left-sidebar">
  {#if $leftSidebar === "collections"}
     <Collections />
  {/if}</div>
  <slot></slot>
  <div slot="right-sidebar">

    {#if $book.id}
      <InfoActions modal={false} rightSidebar={true} />
    {/if}
  </div>
</WithSidebars>