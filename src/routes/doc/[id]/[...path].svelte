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
      const bookData = await response.json();
      const chapterResource = bookData.resources.find(item =>
        item.url.endsWith(path.join("/"))
      );
      chapterResource.index = bookData.readingOrder
        .map(item => item.url)
        .indexOf(chapterResource.url);
      const chapterResponse = await this.fetch(
        `/api/parse-chapter?chapter=${encodeURIComponent(
          chapterResource.url
        )}&index=${chapterResource.index}`
      , {credentials: "include"});
      let chapterData = await chapterResponse.json();
      chapterData = { ...chapterData, ...chapterResource };
      bookData.id = id;
      return { bookData, chapterData };
    } catch (err) {
      return this.error(err)
    }
  }
</script>

<script>
  import { book, chapter, contents, navigation } from "../../../doc/stores.js";
  import Book from "../../../doc/Book.svelte";
  export let bookData;
  export let chapterData;
  book.set(bookData);
  chapter.set(chapterData);
</script>

<style>
  /* your styles go here */
</style>

<pre>
{JSON.stringify($book, 2, null)}
{$book.name}
{$chapter.url}
{$chapter.encodingFormat}
{$book.navigation.previous}{$book.navigation.next}{$book.navigation.current}
{$contents.children}
</pre>
{@html $chapter.html}

<!-- <Book /> -->
