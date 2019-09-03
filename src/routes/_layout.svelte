<script>
  import Toolbar from '../components/Toolbar.svelte';
  import Login from '../components/Login.svelte'
	import Profile from '../components/Profile.svelte'
	import Loading from '../components/Loading.svelte'
  import {profile} from '../routes/_profile.js'
	export let segment;
</script>

<style>

	main {
		position: relative;
		padding: 0;
		margin: 0 auto;
		box-sizing: border-box;
		min-height: 100vh;
	}
	:global(body) {
		background-color: var(--main-background-color);
	}
</style>

<Login />
<Profile />

{#if !$profile.loading}
<main>
	<slot></slot>
</main>
{:else}
	<Loading />
{/if}