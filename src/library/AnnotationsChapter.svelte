<script>
  // your script goes here
  import InfoNotesList from "./InfoNotesList.svelte";
  export let chapter;
  export let index;
  export let id;
  export let type;
  let annotations = window
    .fetch(`/api/notes?path=${encodeURIComponent(chapter.url)}`)
    .then(response => response.json());
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<div class="AnnotationsChapter">
  {#await annotations}
    <p class="Loading">Loading...</p>
  {:then notes}
    {#if notes.items[0] && notes.items[0].json && notes.items[0].json.chapterTitle}
      <h2>{notes.items[0].json.chapterTitle}</h2>
    {/if}
    <InfoNotesList notes={notes.items} {id} {type} />
  {:catch error}
    <!-- promise was rejected -->
  {/await}
</div>
