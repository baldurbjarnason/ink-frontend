<script>
  import Toolbar from '../../components/Toolbar.svelte';
  import List from '../../library/List.svelte'
	import {onMount} from 'svelte'
	import {profile} from '../_profile.js'
  import {open} from '../../actions/modal.js'
	export let items
</script>
<script context="module">
	export async function preload(page, session) {
    try {
      const {collection} = page.params
      let books = {items: []}
      if (session.profile) {
        books = await this.fetch(`/api/collections?collection=${collection}&page=1`, {
        credentials: 'include'})
          .then(response => response.json())
      }
      return { items: books.items };
    } catch (err) {
      console.log(err)
      return {items: []}
    }
	}
</script>

<style>
	.Front {
		padding: var(--reader-left-margin);
	}

	@media (min-width: 480px) {
	}
</style>

<svelte:head>
	<title>Uploads – Rebus Ink</title>
</svelte:head>
<!-- Menubar -->
<Toolbar>
<a use:open={{id: 'collections-modal'}} slot="left-button" href="/" class="Toolbar-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg> 
</a>
<span slot="toolbar-title">Uploads</span>
</Toolbar>
<div class="Front">

	<!-- Recent -->
	{#if items}
		 <List list={items} />
	{/if}
</div>
