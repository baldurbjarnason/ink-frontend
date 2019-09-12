<script>
  export let item
  export let indent = 0
</script>

<style>
  li {
    counter-increment: contents;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li > a:before, li > span:before {
    content: counters(contents, ".") ". ";
  }
  li > ol {
    counter-reset: contents;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  [data-indent="1"] a, [data-indent="1"] span {
    padding-left: 1rem;
  }
  [data-indent="2"] a, [data-indent="2"] span {
    padding-left: 2rem;
  }
  [data-indent="3"] a, [data-indent="3"] span {
    padding-left: 3rem;
  }
  [data-indent="4"] a, [data-indent="4"] span {
    padding-left: 4rem;
  }
  a {
    text-decoration: none;
    display: block;
    padding: 0.25rem 1rem;
    border-radius: 0;
    margin-left: -1px;
  }
  a:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  a:focus {
    background-color: var(--rc-lighter);
    color: black;
  }
</style>

<li data-indent={indent}>
  {#if item.url}
  <a href="{item.url}">{item.label}</a>
  {:else}
  <span>{item.label}</span>
  {/if}
  {#if item.children}
    <ol>
     {#each item.children as child}
        <svelte:self item={child} indent={indent + 1} />
     {/each}
    </ol>
  {/if}
</li>