<script>
  // your script goes here
  import Highlight from './Highlight.svelte'
  export let notes
  export let index
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
  <div class="AnnotationsChapter">
      {#if notes}
        {#each notes as note}
          <Highlight note={note} />
        {/each}
      {/if}
  </div>