<script>
  import NotesList from "../src/library/NotesList.svelte";
  // your script goes here
  export let layout;
  export let notes;
  export let current;
</script>

<style>
  /* your styles go here */
</style>

<NotesList {layout} {notes} collection={'all'} {current} />

<!-- markup (zero or more items) goes here -->
