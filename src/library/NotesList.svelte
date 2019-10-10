<script>
  // your script goes here
  import { decode, encode } from "universal-base64url";
  import Highlight from "./Highlight.svelte";
  export let notes;
  export let index;
  export let withSidebar = false;
  export let collection;
  export let current;
  $: if (notes) {
    notes.forEach(note => {
      if (note && note.id) {
        const query = new window.URLSearchParams(window.location.search);
        query.set("note", encode(note.id));
        // We base64url encode the url here because a lot of CDNs have problems with urls in urls, even when properly escaped as URL components.
        note.edit = `/collections/${collection}/notes/?${query.toString()}`;
      }
      note.publication = processPublication(note.publication);
    });
  }
  function processPublication(item) {
    if (!item) return {};
    if (item.id) {
      const query = new window.URLSearchParams(window.location.search);
      query.set("item", encode(item.id));
      // We base64url encode the url here because a lot of CDNs have problems with urls in urls, even when properly escaped as URL components.
      item.url = `/collections/${collection}/notes/?${query.toString()}`;
    }
    return item;
  }
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<div class="NotesList">
  {#if notes}
    {#each notes as note}
      <div class="Note">
        <Highlight {note} edit={note.edit} {current} />
      </div>
    {/each}
  {/if}
</div>
