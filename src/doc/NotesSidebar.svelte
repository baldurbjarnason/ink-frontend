<script>
  import { stores } from "../stores";
  import NotesList from '../library/NotesList.svelte'
  import Toolbar from "../components/Toolbar.svelte";
  export let modal = false;
  const {
    docStore,
    chapterStore,
    chapterTitle,
    notes,
    updateNotes
  } = stores();
  let items
  $: if ($notes) {
    items = $notes.items
  }
</script>

<style>
  .wrapper {
  }
</style>
<div class="wrapper">
{#if !modal}
  <Toolbar notes={true}>
        <span slot="left-button" class="LeftButton" />
        <span slot="toolbar-title">Notes</span>
        <span slot="right-button" class="LeftButton" />
  </Toolbar>
{/if}
  <NotesList notes={items} current={modal && $updateNotes} />
</div>