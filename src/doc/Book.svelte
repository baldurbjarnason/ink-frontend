<script>
// Process:
// Preload in doc/[id].svelte
//    - /id-to-opf to get a full featured JSON
//    - set book store with id and href
// Preload in doc/[id]/[...path].svelte
//    - use /id-to-opf to get a full featured JSON
//    - use parse-chapter to get chapter
//    - set chapter store with href
// Book.svelte, called with book json and chapter and params - onMount:
// - set up settings store
// - derive contents store from book store
// - derive bookmarks store from book
// Chapter.svelte - onMount:
// - set up current location store
// - navigation data from book + chapter href
// - derive annotations store from book + chapter
// - derive chapter title from book + contents + chapter.href
  import Toolbar from './Toolbar.svelte'
  import Navbar from './Navbar.svelte'
  import Chapter from './Chapter.svelte'
  import Progress from './Progress.svelte'
  import ContentsButton from './ContentsButton.svelte'
  import { getContext, setContext } from 'svelte'
  import {getNavigation} from '../api/get-navigation.js'
  export let bookId
  export let bookPath
  let api = getContext('ink-api')
  let book
  if (bookId) {
    book = api.book
      .get(`/${bookId}`)
  }
  let navigationPromise
  if (book && bookPath) {
    navigationPromise = getNavigation(bookPath, book)
  }
  let currentLocation
  function handleCurrent ({detail}) {
    currentLocation = detail.highest.dataset.location
  }
  let loadedLocations = []
  function handleAppearing ({detail}) {
    loadedLocations = loadedLocations.concat(detail.nodes)
  }
  // your script goes here
</script>

<style>
.BookBody {
  min-height: 100vh;
  background-color: white;
}
</style>

<!-- markup (zero or more items) goes here -->
<Toolbar returnPath={'/info' + bookId}>
  <div slot="left-button"><ContentsButton /></div>
{#if book}
  {#await book}
    <!-- promise is pending -->
    <div class="BookToolbar-title">Loading...</div>
  {:then bookObject}
    <!-- promise was fulfilled -->
    <div class="BookToolbar-title">{bookObject.name}</div>
  {:catch error}
    <!-- promise was rejected -->
    <div class="BookToolbar-title">Loading failed!</div>
  {/await} 
{/if} 
</Toolbar>
{#if book}
  {#await book}
    <!-- promise is pending -->
    <div class="BookBody BookBody--loading Loading">Loading...</div>
  {:then bookObject}
    <!-- promise was fulfilled -->
    <div class="BookBody">
    {#each bookObject.readingOrder as chapter, index}
       <!-- content here -->
       <Chapter chapter={chapter} book={bookObject} current={bookPath} index={index} on:current={handleCurrent} on:appearing={handleAppearing} />
    {/each}
    </div>
  {#if navigationPromise}
    {#await navigationPromise}
      <!-- promise is pending -->
      <Navbar />
    {:then navigation}
      <Navbar navigation={navigation}>
        <Progress chapters={bookObject.readingOrder} current={bookPath} />
      </Navbar>
    {/await} 
  {/if} 
  {:catch error}
    <!-- promise was rejected -->
    <div class="BookBody BookBody--failed">Loading failed!</div>
  {/await} 
{/if} 

