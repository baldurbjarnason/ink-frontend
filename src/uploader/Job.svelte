<script>
  import { onMount, tick } from "svelte";
  export let jobId;
  let job;
  onMount(() => {
    check(testJob, 100000, 2000);
  });
  async function check(fn, timeout, interval) {
    const endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;
    while (!job) {
      const result = await fn();
      if (result && (result.finished || result.error || result.published)) {
        job = result;
        return result;
      } else if (Number(new Date()) < endTime) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }
  async function testJob() {
    try {
      const response = await window.fetch(
        `/api/get?path=${encodeURIComponent(`/job-${jobId}`)}`,
        { credentials: "include" }
      );
      return response.json();
    } catch (err) {
      return { error: true };
    }
  }
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<li>
  {#if job.finished || job.published}
    Processing done
  {:else if job.error}Error processing epub{:else}Processing epub{/if}
</li>
