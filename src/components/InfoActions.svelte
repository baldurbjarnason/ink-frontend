<script>
  import Button from "./Button.svelte";
  import TextButton from "./TextButton.svelte";
  import { book as item, current } from "../stores/book.js";
  export let modal;
  let book = { navigation: { current: {} } };
  $: if ($item.id && $item.id !== book.id) {
    updateBook($item.id);
  }
  async function updateBook(id) {
    book = { navigation: { current: {} } };
    const response = await fetch(`/api/book?url=${encodeURIComponent(id)}`);
    book = await response.json();
    return book;
  }
</script>

<style>
  h1 {
    text-align: center;
    font-size: 2rem;
    margin-top: 2rem;
    color: var(--medium);
    font-weight: 600;
  }
  ol,
  .return {
    margin: 1rem auto;
    min-width: 120px;
    max-width: 450px;
    width: 100%;
  }
  ol {
    border-left: 1px solid var(--rc-main);
  }
  ol a {
    text-decoration: none;
    display: block;
    padding: 0.25rem 1rem;
    border-radius: 0;
    margin-left: -1px;
  }
  ol a:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  ol a:focus {
    background-color: var(--rc-lighter);
    color: black;
  }
  ol li {
    list-style: none;
  }
  .return {
    text-decoration: none;
    line-height: 0.1;
    display: flex;
    align-items: center;
    padding: 0.5rem calc(1rem - 16px);
    text-transform: uppercase;
    font-size: 0.75rem;
    border-radius: 0;
    margin-top: 0;
  }
  .return:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  .return svg {
    height: 14px;
    width: 16px;
  }
  ol a.current {
    border-left: 5px solid var(--rc-darker);
    padding-left: calc(1rem - 6px);
    font-weight: 600;
  }
</style>

{#if $current}
  <a href="/collections/all" class="return" data-close-modal>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
    Library
  </a>
{/if}
{#if modal}
  <h1>{$item.name}</h1>
{/if}
<ol>
  <li>
    <a
      class:item={true}
      href={book.navigation.current.path}
      data-close-modal
      class:current={$current === 'read'}>
      {book.position ? 'Continue' : 'Read'}
    </a>
  </li>
  <li class="first-item">
    <a
      href="{$item.url}metadata"
      data-close-modal
      class:current={$current === 'metadata'}>
      Metadata
    </a>
  </li>
  <li>
    <a
      href="{$item.url}contents"
      data-close-modal
      class:current={$current === 'contents'}>
      Contents
    </a>
  </li>
  <li class="last-item">
    <a
      href="{$item.url}annotations"
      data-close-modal
      class:current={$current === 'annotations'}>
      Annotations
    </a>
  </li>
</ol>
