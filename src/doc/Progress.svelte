<script>
  // your script goes here
  export let current;
  export let chapters;
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
  .Progress {
    position: fixed;
    top: 40px;
    left: 13px;
    width: 12px;
    display: flex;
    flex-direction: column;
  }
  @media (min-width: 1024px) {
    .Progress {
      left: calc(var(--reader-sidebar-width, 0px) + 13px);
    }
  }
</style>

<div class="Progress">
{#if chapters}
  {#each chapters as chapter, i}
    <!-- content here -->
    {#if i === current}
      <svg class="current"><circle cx="6" cy="6" r="3" /></svg>
    {:else}
      <svg><circle cx="6" cy="6" r="2"/></svg>
    {/if}
  {/each}
{/if}
</div>
