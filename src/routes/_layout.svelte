<script>
  import Toolbar from '../components/Toolbar.svelte';
  import Login from '../components/Login.svelte'
  import Profile from '../components/Profile.svelte'

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
<main>
	<slot></slot>
</main>