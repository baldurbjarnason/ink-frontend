<script>
  import { decode, encode } from "universal-base64url";
  import WithSidebars from "../components/WithSidebars.svelte";
  import { stores as inkStores } from "../stores";
  import Collections from "../collections/Collections.svelte";
  import InfoActions from "../components/InfoActions.svelte";
  import { stores, goto } from "@sapper/app";
  const { page, session } = stores();
  const {
    title,
    leftSidebar,
    rightSidebar,
    infoBook,
    currentInfoBook
  } = inkStores();
  let query = {};
  $: if ($page) {
    query = $page.query;
  }
  $: if (query.book) {
    infoBook.set();
    infoBook.set({ id: decode(query.book) });
    currentInfoBook.set("");
  }
  $: if ($session) {
    console.log($session);
  }
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<WithSidebars
  title={$title}
  leftModal={$leftSidebar + '-modal'}
  rightModal={$rightSidebar + '-modal'}>
  <div slot="left-sidebar">
    {#if $leftSidebar === 'collections'}
      <Collections />
    {/if}
  </div>
  <slot />
  <div slot="right-sidebar">

    {#if $infoBook.id}
      <InfoActions modal={false} rightSidebar={true} />
    {/if}
  </div>
</WithSidebars>
