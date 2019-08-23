import { writable, derived } from 'svelte/store';

export const book = writable({})

export const chapter = writable({})

export const contents = derived(book, ($book, set) => {
  if ($book.resources) {
    const toc = $book.resources.find(item => item.rel.includes('ncx')|| item.rel.includes('contents'))
    try {
      window.fetch(`/api/parse-toc?toc=${encodeURIComponent(toc.url)}`)
        .then(response => response.json())
        .then(tocData => set(tocData))
    } catch (err) {
      console.error(err)
    }
  } else {
    set({})
  }
})

export const navigation = derived([book, chapter], ([$book, $chapter]) => {
  let prev
  let next
  let current
  if ($book.resources && $chapter.index) {
    prev = $book.resources[$chapter.index - 1]
    next = $book.resources[$chapter.index + 1]
    current = $book.resources[$chapter.index]
  }
  return {prev, current, next}
})

export const chapterTitle = derived([chapter, contents], ([$chapter, $contents]) => {
  function findTitle (currentTitle, entry) {
    const path = new URL(entry.url, 'http://example.com/').pathname
    if ($chapter.url.includes(path)) {
      return entry.label
    } else if (entry.children) {
      return entry.children.reduce(findTitle, currentTitle)
    } else {
      return currentTitle
    }
  }
  if ($chapter && $contents) {
    return $contents.children.reduce(findTitle, '')
  } else {
    return ''
  }
})

// Locations:
// This should be an array of `{id, location, annotations, top (window.scrollX + top), bottom (top + height)}`, sorted by order of appearance
// From this we can derive a chapter title (down to the sub chapter level and how many annotations each location has)
// And we can render an abstract minimap

export const fontSize = writable('0.9rem')

export const theme = writable('Publisher')

export const currentLocation = writable({
  path: null,
  doc: null,
  location: null
})