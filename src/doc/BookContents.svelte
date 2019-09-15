<script>
  import {contents, book} from './stores.js'
  import Contents from './Contents.svelte'
  export let modal = false
</script>

<style>
  .BookContents {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    max-height: 100vh;
    background-color: var(--sidebar-background-color);
  }
  .BookContents.modal {
    background-color: white;
    padding-top: 32px;
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
    margin-bottom: 2rem;
  }
  .return:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  .return svg {
    height: 14px;
    width: 16px;
  }
</style>

<div class="BookContents" class:modal={modal}>
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
  {#if $contents.children && $book}
    <Contents contents={$contents} book={$book}  />
  {/if}
</div>