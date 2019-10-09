<script>
  // your script goes here
  import { open } from "../actions/modal.js";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let current;
  export let chapters;
  export let width;
  let scroll;
  let height;
</script>

<style>
  svg {
    width: 12px;
    height: 12px;
    fill: #999;
  }
  .current {
    fill: var(--rc-darker);
  }

  button.Toolbar-link.Progress {
    font-family: var(--sans-fonts);
    font-weight: 400;
    flex: 0 1 auto;
    line-height: 1.2;

    display: inline-block;
    padding: 5px 5px 4px;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;

    color: var(--link);
    border: none;
    background-color: transparent;

    -ms-touch-action: manipulation;
    touch-action: manipulation;
    text-transform: uppercase;
    font-size: 0.65rem;
    border-bottom: solid 3px transparent;
    position: sticky;
    top: 40px;
    width: 24px;
    display: flex;
    flex-direction: column;
    padding: 0.25rem;
    align-items: center;
    z-index: 1;
  }
  @media (min-width: 1024px) {
    .Progress {
      left: calc(var(--reader-sidebar-width, 0px) + 13px);
    }
  }
</style>

{#if width <= 1024}
  <button
    type="Button"
    use:open={{ id: 'contents-modal' }}
    class="Toolbar-link Progress">
    {#if chapters}
      {#each chapters as chapter, i}
        <!-- content here -->
        {#if i === current}
          <svg class="current">
            <circle cx="6" cy="6" r="3" />
          </svg>
        {:else}
          <svg>
            <circle cx="6" cy="6" r="2" />
          </svg>
        {/if}
      {/each}
    {/if}
  </button>
{:else}
  <button
    on:click={() => dispatch('toggle-sidebar')}
    href="/"
    class="Toolbar-link Progress">
    {#if chapters}
      {#each chapters as chapter, i}
        <!-- content here -->
        {#if i === current}
          <svg class="current">
            <circle cx="6" cy="6" r="3" />
          </svg>
        {:else}
          <svg>
            <circle cx="6" cy="6" r="2" />
          </svg>
        {/if}
      {/each}
    {/if}
  </button>
{/if}
