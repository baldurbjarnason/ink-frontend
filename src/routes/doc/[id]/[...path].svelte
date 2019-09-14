<script context="module">
  // your script goes here
  export async function preload({ params, query }) {
    try {
      const { id, path } = params;
      const response = await this.fetch(
        `/api/id-to-opf?id=%2F${encodeURIComponent(id)}`, {
          credentials: "include"
        }
      );
      const book = await response.json();
      const chapterResource = book.resources.find(item =>
        item.url.endsWith(path.join("/"))
      );
      chapterResource.index = book.readingOrder
        .map(item => item.url)
        .indexOf(chapterResource.url);
      const chapterResponse = await this.fetch(
        `/api/parse-chapter?chapter=${encodeURIComponent(
          chapterResource.url
        )}&index=${chapterResource.index}`
      , {credentials: "include"});
      let chapter = await chapterResponse.json();
      chapter = { ...chapter, ...chapterResource };
      book.id = id;
      return { book, chapter };
    } catch (err) {
      return this.error(err)
    }
  }
</script>

<script>
  import { slide } from "svelte/transition";
  import { open } from "../../../actions/modal.js";
  import Chapter from "../../../doc/Chapter.svelte";
  import Navbar from "../../../doc/Navbar.svelte";
  import Progress from "../../../doc/Progress.svelte";
  import Toolbar from "../../../components/Toolbar.svelte";
  import InfoActions from "../../../components/InfoActions.svelte";
  import {
    book as bookStore,
    chapter as chapterStore,
    navigation,
    contents,
    currentLocation,
    theme,
    fontSize,
    chapterTitle
  } from "../../../doc/stores.js";
  function handleCurrent({ detail }) {
    console.log(detail)
    currentLocation.set({
      location: detail.highest.dataset.location
    });
  }
  let loadedLocations = [];
  function handleAppearing({ detail }) {
    console.log(detail)
    loadedLocations = loadedLocations.concat(detail.nodes);
  }
  let bookBody;
  if (bookBody) {
    bookBody.style.setProperty("--reader-font-size", $fontSize);
  }
  export let book
  export let chapter
  $: if (book) {
    bookStore.set(book)
  }
  $: if (chapter) {
    chapterStore.set(chapter)
  }
  let width = 0;
  let sidebar = true;
  let sidebargrid = true;
  let sidebarWidth
  $: if (sidebarWidth !== getComputedStyle(document.documentElement)
    .getPropertyValue('--reader-sidebar-width') + 'px') {
      document.documentElement.style
    .setProperty('--reader-sidebar-width', sidebarWidth + 'px');
    }
</script>

<style>
  .Sidebar {
    display: none;
  }
  @media (min-width: 1024px) {
    .BookBody.sidebar {
      display: grid;
      grid-template-columns: min-content 1fr;
      grid-template-areas:
        "sidebar body"
        "sidebar body"
        "sidebar body";
    }
    .BookBody.sidebar :global(.Chapter) {
      grid-column: 2 / -1;
    }
    .Sidebar {
      display: block;
      background-color: white;
      height: 100vh;
      position: sticky;
      top: 0px;
      grid-area: sidebar;
      padding: 0 0.25rem;
    }
  }
</style>
<!-- 
{@html chapter.html} -->
<svelte:head>
  {#if chapter.stylesheets.length !== 0}
    {#each chapter.stylesheets as sheet}
      <link rel="stylesheet" href={`/api/clean-css?css=${encodeURIComponent(sheet)}`} />
    {/each}
  {/if}
  <title>{book.name} - {$chapterTitle} - Rebus Ink</title>
</svelte:head>

{#if book}
  <div class="BookBody" bind:this={bookBody} class:sidebar={sidebargrid}>
  {#if sidebar}
    <div
      bind:clientWidth={sidebarWidth}
      class="Sidebar"
      transition:slide={{ delay: 250, duration: 300 }}
      on:introstart={() => (sidebargrid = true)}
      on:outroend={() => (sidebargrid = false)}>
      <InfoActions modal={false} />
    </div>
  {/if}
  <!-- Menubar -->
  <Toolbar>
    <span slot="left-button">
      {#if width <= 1024}
        <a use:open={{ id: 'item-modal' }} href="/" class="Toolbar-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="square"
            stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </a>
      {:else}
        <button
          on:click={() => {
            sidebar = !sidebar;
          }}
          href="/"
          class="Toolbar-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="square"
            stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      {/if}
    </span>
    <span slot="toolbar-title">{book.name}</span>
  </Toolbar>
    <!-- Should have all chapters appear, they should get values from stores and only use props for chapter assignments. Only when props match store is the chapter rendered -->
    {#each book.readingOrder as chapter, index}
      <Chapter
        on:current={handleCurrent}
        on:appearing={handleAppearing}
        chapterIndex={index} />
    {/each}

    {#if $navigation}
      <Navbar navigation={$navigation} />
    {:else}
      <Navbar />
    {/if}
    <Progress chapters={book.readingOrder} current={chapter.index} />
  </div>
{/if}
