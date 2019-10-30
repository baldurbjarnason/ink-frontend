<script>
  import Highlight from "./Highlight.svelte";
  export let notes;
  export let index;
  export let withSidebar = false;
  export let type;
  export let current;
  export let id;
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<div class="NotesList">
  {#if notes}
    {#each notes as note}
      <div class="Note">
        <Highlight {note} {current} collection={false} modal={false} info={true} />
      </div>
    {/each}
  {/if}
</div>
