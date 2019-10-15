<script>
  import { onMount, tick } from "svelte";
  import {collection as setCollection} from "../api/collection.js"
  import { stores } from "../stores";
  const { collections, recent } = stores();
  export let job;
  export let collection;
  onMount(() => {
    check(testJob, 100000, 2000);
  });
  $: console.log(collection)
  async function check(fn, timeout, interval) {
    console.log('check called: ', timeout, interval)
    const endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;
    while (!(job.finished || job.error)) {
      console.log('interval: ', job)
      const result = await fn();
      if (result && (result.finished || result.error)) {
        job = result;
        await processPublication(job)
        return result;
      } else if (Number(new Date()) < endTime) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }
  async function processPublication (job) {
    const tag = $collections.find(tag => tag.name === collection)
    console.log($collections, collection, tag)
    const publicationResponse = await window.fetch(
      `/api/get?path=${encodeURIComponent(`/publication-${job.publicationId}/`)}&publication=true`,
      { credentials: "include" }
    );
    const publication = await publicationResponse.json();
    recent.update(recentStore => {
      recentStore.items = [publication].concat(recentStore.items)
      return recentStore
    })
    if (!collection || collection === "all") return
    return setCollection(tag, {id: `/publication-${job.publicationId}/`}, true)
  }
  async function testJob() {
    console.log('getting: ', `/api/get?path=${encodeURIComponent(`/job-${job.id}`)}`)
    try {
      const response = await window.fetch(
        `/api/get?path=${encodeURIComponent(`/job-${job.id}`)}`,
        { credentials: "include" }
      );
      return response.json();
    } catch (err) {
      return { error: true };
    }
  }
  $: console.log(job)
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<li>
  {#if job.finished}
    Processing done
  {:else if job.error}Error processing epub{:else}Processing epub{/if}
</li>
