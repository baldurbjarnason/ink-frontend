<script>
  import Collections from "../collections/Collections.svelte";
  import InfoActions from "../components/InfoActions.svelte";
  import BookContents from "../doc/BookContents.svelte";
  import NoteModal from "../doc/NoteModal.svelte";
  import UploadSidebar from "../uploader/UploadSidebar.svelte";
  export let sidebar
  export let collection
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
{#if sidebar === 'item'}
  <InfoActions modal={false} sidebar={true} />
{:else if sidebar === 'contents'}
  <BookContents modal={false} />
{:else if sidebar === 'item'}
  <InfoActions modal={false} sidebar={true} />
{:else if sidebar === 'upload'}
  <UploadSidebar {collection} />
{:else if sidebar === 'note'}
  <NoteModal />
{:else}
  <Collections />
{/if}