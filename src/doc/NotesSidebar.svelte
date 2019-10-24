<script>
  import { stores } from "../stores";
  import NotesList from "../library/NotesList.svelte";
  import Toolbar from "../components/Toolbar.svelte";
  import NotesBar from "./NotesBar.svelte";
  export let modal = false;
  const { chapterTitle, notes, updateNotes, docStore } = stores();
</script>

<style>
  .wrapper {
    min-height: 100vh;
  }
</style>

<div class="wrapper">
  {#if !modal}
    <Toolbar notes={true}>
      <span slot="left-button" class="LeftButton" />
      <span slot="toolbar-title">
        Chapter Notes
        <!-- – {$chapterTitle} -->
      </span>
      <span slot="right-button" class="LeftButton">
      <a href="/api/notes-book-export?id={encodeURIComponent($docStore.id)}" aria-label="Download HTML notes for this book"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg></a>
      </span>
    </Toolbar>
  {/if}
  <NotesList notes={$notes.items} current={modal && $updateNotes} {modal} />
  <NotesBar />
</div>
