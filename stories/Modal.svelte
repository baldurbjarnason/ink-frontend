<script>
  // your script goes here
  import {modal, click, keydown, open} from '../src/actions/modal.js'
  import { fly } from 'svelte/transition'
  console.log($modal)
</script>

<style>
  /* your styles go here */
  .Modal:not([hidden]) [role="document"]{
    background-color: #fff;
    max-width: 95vw;
    max-height: 100vh;
    min-width: 300px;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 14px -2px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
  [aria-hidden='true'] [role="document"] {
    opacity: 0;
    transform: translateX(-100%);
  }
</style>

<!-- markup (zero or more items) goes here -->

<button use:open={{id: 'test-modal', label: 'Use This'}}>Click Me!</button>

<div class="Modal" on:click={click} on:keydown={keydown} id="test-modal" aria-hidden="true" hidden="true" role="dialog" tabIndex="-1">
{#if $modal}
   <div role="document" transition:fly={{ y: 200, duration: 2000 }}>
<h1>Modal Content.</h1>
<p>  <input type="text">
<button type="Button" data-close-modal>Close</button></p>
</div>
{/if}
</div>