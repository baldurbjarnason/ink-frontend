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
  .Progress {
    position: fixed;
    top: 40px;
    left: 4px;
    width: 12px;
    display: flex;
    flex-direction: column;
  }
</style>

<div class="Progress">
{#if chapters}
  {#each chapters as chapter, i}
    <!-- content here -->
    {#if i === current}
      <svg><circle cx="6" cy="6" r="3" fill="#333" /></svg>
    {:else}
      <svg><circle cx="6" cy="6" r="2"/></svg>
    {/if}
  {/each}
{/if}
</div>
