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
      book.url = book.id;
      book.id = id;
      return { book, chapter };
    } catch (err) {
      return this.error(err)
    }
  }
</script>

<script>
  import { onMount, tick } from 'svelte';
  import { slide } from "svelte/transition";
  import Chapter from "../../../doc/Chapter.svelte";
  import Navbar from "../../../doc/Navbar.svelte";
  import Progress from "../../../doc/Progress.svelte";
  import BookContents from "../../../doc/BookContents.svelte";
  import Toolbar from "../../../components/Toolbar.svelte";
  import InfoActions from "../../../components/InfoActions.svelte";
  import {read} from '../../../api/read.js'
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
    currentLocation.set({
      location: detail.highest.dataset.location
    });
  }
  let loadedLocations = [];
  function handleAppearing({ detail }) {
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
  $: console.log($bookStore.position);
  let sidebar = true;
  let sidebargrid = true;
  let sidebarWidth
  $: if (sidebarWidth !== getComputedStyle(document.documentElement)
  .getPropertyValue('--reader-sidebar-width') + 'px') {
    document.documentElement.style
  .setProperty('--reader-sidebar-width', sidebarWidth + 'px');
  }

  onMount(async () => {
    window.lifecycle.addEventListener('statechange', handleLifeCycle)
    await tick()
    if ($bookStore.position && $bookStore.position.path === $chapterStore.url) {
      const location = document.querySelector(`[data-location="${$bookStore.position.location}"]`)
      if (location) {
        location.scrollIntoView({behavior: 'smooth'})
      }
    }
    return () => {
      const url = $bookStore.url
      const location = $currentLocation.location
      const chapter = $chapterStore.url
      
      read(url, location, chapter)
      window.lifecycle.removeEventListener('statechange', handleLifeCycle)
    }
  });
  function handleLifeCycle (event) {
      if (
        window.lifecycle.state === 'passive' &&
        event.oldState === 'active' &&
        $currentLocation
      ) {
        read($bookStore.url, $currentLocation.location, $chapterStore.url)
      }
  }
</script>

<style>
  .Sidebar {
    display: none;
  }
  @media (min-width: 1024px) {
    .BookBody.sidebar {
      display: grid;
      grid-template-columns: minmax(300px, 0.4fr) 1fr;
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
  .LeftButton {
    align-self: flex-start;
  }
</style>

<svelte:window bind:innerWidth={width} />
<svelte:head>
  {#if chapter.stylesheets.length !== 0}
    {#each chapter.stylesheets as sheet}
      <link rel="stylesheet" href={`/api/clean-css?css=${encodeURIComponent(sheet)}`} />
    {/each}
  {/if}
  <title>{book.name} - {$chapterTitle} - Rebus Ink</title>
</svelte:head>

{#if book}
  <div class="BookBody" bind:this={bookBody} class:sidebar={sidebargrid} data-current={$currentLocation.location}>
  {#if sidebar}
    <div
      bind:clientWidth={sidebarWidth}
      class="Sidebar"
      transition:slide={{ delay: 250, duration: 300 }}
      on:introstart={() => (sidebargrid = true)}
      on:outroend={() => (sidebargrid = false)}>
      <BookContents modal={false} />
    </div>
  {/if}
  <!-- Menubar -->
  <Toolbar>
    <span slot="left-button" class="LeftButton">

    <Progress chapters={book.readingOrder} current={chapter.index} width={width} on:toggle-sidebar={() => {
      sidebar = !sidebar
    }}/>
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
  </div>
{/if}
