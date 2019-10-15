<script>
  // your script goes here
  import DOMPurify from "dompurify";
  import { decode, encode } from "universal-base64url";
  import { update } from "../api/update.js";
  import TextButton from "../components/TextButton.svelte"

  const purifyConfig = {
    KEEP_CONTENT: false,
    RETURN_DOM: true,
    FORBID_TAGS: ["style", "link"],
    FORBID_ATTR: ["style"]
  };
  export let note;
  export let edit;
  export let current;
  export let collection;
  let dom = DOMPurify.sanitize(note.content, purifyConfig);
  let blockquote = dom.querySelector("blockquote");
  let highlight
  if (blockquote) {
    highlight = blockquote.outerHTML;
    dom.removeChild(blockquote);
  }
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
    --reader-font-size: 0.85rem;
    background-color: var(--main-background-color);
    font-size: var(--reader-font-size);
    display: grid;
    grid-template-columns: 1rem 1fr 1rem;
    position: relative;
  }
  .AnnotationsHighlight.archived {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-style: italic;
    color: #666;
    padding-bottom: 0;
    padding: 0.25rem;
    padding-left: 2rem;
    font-size: 0.75rem;
    margin-top: var(--reader-paragraph-spacing);
    margin-bottom: var(--reader-paragraph-spacing);
  }
  .AnnotationsHighlight.selected {
    border-color: #ddd;
  }
  :global(.AnnotationsHighlight > *) {
    grid-column: 2 / 3;
  }
  .AnnotationsHighlight > .Chapter {
    --reader-font-size: 1rem;
    position: relative;
    margin: 0;
    padding: 0;
    line-height: var(--reader-line-height);
    color: var(--reader-text-color);
    grid-column: 1 / -1;
  }
  .AnnotationsHighlight .ReaderComment {
    position: relative;
    --reader-font-size: 0.85rem;
    display: grid;
    padding-left: 1.25rem;
    /* padding-top:24px; */
    padding-right: 2.5rem;
    background-color: #f9f9f9;
    border-color: #f0f0f0;
  }
  .AnnotationsHighlight.selected .ReaderComment {
    background-color: #fafafa;
    outline: solid #ccc 2px;
  }
  .AnnotationsHighlight > .Chapter > :global(blockquote) {
    border-left: 1px solid #ddd;
    padding-left: 2.5em;
    padding-right: 2.5rem;
    margin-left: 0;
    margin-top: var(--reader-paragraph-spacing);
    margin-bottom: var(--reader-paragraph-spacing);
    line-height: 1.2;
    font-family: var(--reader-font-family);
  }
  .edit {
    text-transform: uppercase;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    text-decoration: none;
  }
  .Chapter .edit :global(a) {
    text-decoration: none;
  }
  .archive {
    text-transform: uppercase;
    position: absolute;
    top: var(--reader-paragraph-spacing);
    right: 0;
    font-size: 0.85rem;
    z-index: 1;
    text-decoration: none;
  }
  .Chapter .archive :global(a) {
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
{#if !archived && collection}
  <a class="title" href={note.publication.url}>{note.publication.name}</a>
{/if}
<div class="AnnotationsHighlight" class:selected class:archived>
{#if archived}
  <span>{#if collection}
    {note.publication.name}: 
  {/if}{note['oa:hasSelector'].exact.slice(0, 40)}... (Archived)</span> <TextButton click={() => {
    const json = {...note.json, archived: false}
    note = {...note, json}
    archived = false
    try {
      return update({...note, json})
    } catch (err) {}
  }}>Unarchive</TextButton>
{:else}
  <div class="Chapter">{@html highlight}
  <div class="ReaderComment">{@html dom.innerHTML}
  <span class="edit"><TextButton href={edit}>Edit</TextButton></span>
 
  
  </div><span class="archive"> <TextButton click={() => {
    const json = {...note.json, archived: true}
    archived = true
    try {
      return update({...note, json})
    } catch (err) {}
  }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></TextButton></span>
  </div>
  
{/if}
</div>
