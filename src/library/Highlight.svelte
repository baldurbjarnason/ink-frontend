<script>
  // your script goes here
  import DOMPurify from "dompurify";
  import { decode, encode } from "universal-base64url";
  import { update } from "../api/update.js";
  import TextButton from "../components/TextButton.svelte"
  const purifyConfig = {
    KEEP_CONTENT: false,
    FORBID_TAGS: ["style", "link"],
    FORBID_ATTR: ["style"]
  };
  export let note;
  export let edit;
  export let current;
  let selected;
  $: if (current === note.id) {
    selected = true;
  }
  let archived
  $: if (note.json.archived) {
    archived = true
  }
</script>

<style>
  .AnnotationsHighlight {
    --reader-font-size: 0.75rem;
    margin: 1rem;
    background-color: #fefdd3;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    font-size: var(--reader-font-size);
    display: grid;
    grid-template-columns: 1rem 1fr 1rem;
    position: relative;
    border: 0.25rem solid #ffffbd;
    padding-bottom: 1rem;
  }
  .AnnotationsHighlight.archived {
    display: block;
    background-color: var(--light);
    font-style: italic;
    border-color: var(--light);
    padding-bottom: 0;
  }
  .AnnotationsHighlight.selected {
    background-color: var(--light);
    border-color: #ddd;
  }
  :global(.AnnotationsHighlight > *) {
    grid-column: 2 / 3;
  }
  :global(.AnnotationsHighlight > blockquote) {
    --reader-font-size: 0.75rem;
    position: relative;
    background-color: white;
    margin: 0;
    padding: 1rem;
    line-height: var(--reader-line-height);
    color: var(--reader-text-color);
    font-family: "Source Serif Pro", serif;
    border-bottom: 1px solid #ddd;
    border-radius: 0.25rem;
    grid-column: 1 / -1;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .edit {
    text-transform: uppercase;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    text-decoration: none;
  }
  .archive {
    text-transform: uppercase;
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 0.85rem;
    z-index: 1;
    text-decoration: none;
  }
  .title {
    text-transform: uppercase;
    font-size: 0.75rem;
    margin: 0;
    padding: 0 1rem;
    display: block;
    text-decoration: none;
  }
</style>

<!-- markup (zero or more items) goes here -->
{#if !archived}
  <a class="title" href={note.publication.url}>{note.publication.name}</a>
{/if}
<div class="AnnotationsHighlight" class:selected class:archived>
{#if archived}
  {note.publication.name}: {note['oa:hasSelector'].exact.slice(0, 40)}... (Archived) <TextButton click={() => {
    const json = {...note.json, archived: false}
    note = {...note, json}
    archived = false
    try {
      return update({...note, json})
    } catch (err) {}
  }}>Unarchive</TextButton>
{:else}
  <span class="edit"><TextButton href={edit}>Edit</TextButton></span>
  {@html DOMPurify.sanitize(note.content, purifyConfig)}
 <span class="archive"> <TextButton click={() => {
    const json = {...note.json, archived: true}
    archived = true
    try {
      return update({...note, json})
    } catch (err) {}
  }}>Archive</TextButton></span>
{/if}
</div>
