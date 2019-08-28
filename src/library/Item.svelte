<script>
  // your script goes here
  export let book = {}
  export let layout = 'covers'
  console.log(book)
  let { resources = [], author = [] } = book
  let url
  if (book.id) {
    const pathname = new URL(book.id).pathname
    url = `/info${pathname}`
  }
  if (resources && resources.data) {
    resources = resources.data
  }
  const coverResource = resources.find(resource =>
    resource.rel.includes('cover')
  )
  let cover
  if (coverResource) {
    cover = coverResource.url
  } else {
    cover = '/static/placeholder-cover.jpg'
  }
</script>

<style>
.LibraryItem {
  position: relative;
  font-family: var(--sans-fonts);
}
.LibraryItem > .covers {
  display: grid;
}
@keyframes withinPop {
  0% {
    box-shadow: 0 0 0 5px rgb(228, 255, 254, 0.2);
    background-color: rgb(228, 255, 254, 0.2);
  }
  50% {
    background-color: rgb(228, 255, 254, 0.8);
    box-shadow: 0 0 0 5px rgb(228, 255, 254, 0.8);
  }
  100% {
    box-shadow: 0 0 0 5px var(--rc-lighter);
    background-color: var(--rc-lighter);
  }
}
.LibraryItem > .covers:focus-within {
  background-color: var(--rc-lighter);
  box-shadow: 0 0 0 5px var(--rc-lighter);
  animation: withinPop 0.25s ease-in-out;
}
.list {
  display: grid;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0.25rem;
  padding-bottom: 0.5rem;
}

.BookCard-group {
  margin-right: 0;
}

.BookCard-icon {
  font-size: 0.75rem;
  text-align: center;
  line-height: 7;
  text-transform: uppercase;
  color: #999;
  background-color: #f0f0f0;
  display: block;
  width: 100%;
  max-height: none;
  object-fit: cover;
  object-position: top left;
  width: 6rem;
  height: 8.5rem;
  border-radius: var(--border-radius);
}
.BookCard-title {
  margin: 0.25rem 0;
  padding: 0;
  font-weight: 750;
  font-size: 0.7rem;
  line-height: 1;
}

.BookCard-attribution {
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  color: #666;
}
.BookCard-attributionLabel {
  font-weight: 300;
  color: #888;
}
a.BookCard-link {
  text-decoration: none;
  font-weight: inherit;
  color: var(--dark);
  display: inline-block;
}
.BookCard-paragraph {
  line-height: 0.75rem;
  font-weight: 300;
  margin-top: 0.25rem;
  font-size: 0.65rem;
  --local-font-size: 0.65rem;
}
.BookCard-paragraph--tags {
  margin-top: 0.5rem;
}
.square .BookCard-group {
  display: none;
}
.square .BookCard-icon {
  width: 100%;
  height: 6rem;
  border-radius: 0px;
}
.list .BookCard-icon {
  display: none;
}
.list .BookCard-paragraph {
  padding: 0;
  margin: 0;
}
@keyframes outlinePop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
a:focus {
  background-color: var(--rc-lighter);
  box-shadow: 0 0 0 5px var(--rc-lighter);
  outline: solid transparent;
  animation: outlinePop 0.25s ease-in-out;
}

</style>

<!-- markup (zero or more items) goes here -->
  <div class="LibraryItem">
      <div class={layout}><a href="{url}" class="icon-link">
      <img class="BookCard-icon" alt="{book.description ||
        ''}" src="{cover}"></a>
      <div class="BookCard-group">
        <h4 class="BookCard-title"><a href="{url}" class="BookCard-link">{
    book.name
  }</a></h4>
        <p class="BookCard-paragraph">
        {#each author as attribution}
           <!-- content here -->
           <span class="BookCard-attribution">{attribution.name}</span>
        {:else}
           <!-- empty list -->
        {/each}</p>
      </div></div>
  </div>