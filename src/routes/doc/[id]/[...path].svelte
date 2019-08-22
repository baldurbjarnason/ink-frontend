<script context="module">
  // your script goes here
  export async function preload ({params, query}) {
    const {id, path} = params
    const response = await this.fetch(`/api/id-to-opf?id=%2F${encodeURIComponent(id)}`)
    const bookData = await response.json()
    const chapterResource = bookData.resources.find(item => item.url.endsWith(path.join('/')))
    const chapterResponse = await this.fetch(`/api/parse-chapter?chapter=${encodeURIComponent(chapterResource.url)}`)
    let chapterData = await chapterResponse.json()
    chapterData = {...chapterData, ...chapterResource}
    return {bookData, chapterData}
  }
</script>

<script>
import {book, chapter} from '../../../doc/stores.js'
export let bookData
export let chapterData
book.set(bookData)
chapter.set(chapterData)
</script>
<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<pre>
{$book.name}
{$chapter.url}
{$chapter.encodingFormat}
</pre>
{@html $chapter.html}