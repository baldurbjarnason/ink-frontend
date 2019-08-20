<script>
	import Toolbar from '../components/Toolbar.svelte';

	export let segment;
</script>

<style>
:root {
  --rc-darker: #2e9595;
  --rc-dark: #32a5a5;
  --rc-main: #37b5b5;
  --rc-medium: #6dc9c9;
  --rc-light: #b8f4f2;
  --rc-lighter: #e4fffe;
  --main-background-color: #f3f7fa;
  --warm-background-color: #f7f6f4;
  --highlight-color: #ffff98;
  --dark: #333333;
  --medium: #555555;
  --light: #fafafa;
  --link: #2e9595;
  --hover: #6dc9c9;
  --active: #00ccee;
  --primary: #cd4b18;
  --visited: #2e9595;
  --error: #ff3b3b;
  --error-light: #fff5f4;
  --valid: #2ed0ac;
  --valid-light: #eefffc;
  --warning: #ffd943;
  --warning-light: #fffbef;
  --disabled: #c6c6c6;
  --button-background-color: #f9f9f9;
}
:root {
  --reader-font-size: 0.9rem;
  --reader-paragraph-spacing: 1rem;
  --reader-left-margin: 2rem;
  --reader-text-color: #444;
  --reader-min-column-width: 12rem;
  --reader-max-column-width: 31rem;
  --reader-background-color: white;
  --reader-border-color: #fafaef;
  --reader-line-height: 1.45;
  --reader-font-family: var(--sans-fonts);
}
@media (max-width: 820px) {
  :root {
    --reader-font-size: 0.85rem;
    --reader-paragraph-spacing: 1rem;
    --reader-left-margin: 1.5rem;
  }
}
@media (max-width: 550px) {
  :root {
    --reader-font-size: 0.7rem;
    --reader-paragraph-spacing: 0.85rem;
    --reader-left-margin: 1rem;
  }
}

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


<Toolbar {segment}/>
<main>
	<slot></slot>
</main>