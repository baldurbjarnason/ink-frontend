<script>
import Item from './Item.svelte'
export let list
export let layout = 'covers'
</script>

<style>
  /* your styles go here */
.List.covers,
.List.square,
.List.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 0.5fr));
  grid-gap: 0.5rem;
  padding-bottom: 1rem;
}
.List.square {
  padding: 0;
  grid-gap: 1px;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fill, 6rem);
}
.List.list {
  padding: 0;
  grid-gap: 1px;
  grid-template-columns: 1fr;
}
</style>

<div class="List {layout}">
{#each list as item}
   <Item book={item} layout={layout} />
{/each}
</div>