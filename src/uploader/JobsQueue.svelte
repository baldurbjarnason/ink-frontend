<script>
  // your script goes here
  import { stores } from "../stores";
  import Job from "./Job.svelte";
  const { jobs } = stores();
  let queue;
  $: if ($jobs) {
    queue = $jobs.filter(job => job.finished || job.error || job.published);
  }
</script>

<style>
  /* your styles go here */
  .UploadQueue h2 {
    transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
      transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
    text-transform: uppercase;
    border-radius: 2rem;
    font-size: 0.7rem;
    color: var(--medium);
    padding: 0.25rem 1rem;
  }
  .UploadQueue ol {
    list-style: none;
    margin: 0;
    padding: 0.5rem 1rem;
  }
</style>

<div class="UploadQueue">
  <h2>
    {#if queue.length === 1}
      Processing {queue.length} file
    {:else if queue.length !== 0}
      Processing {queue.length} files
    {:else}Process queue is done{/if}
  </h2>
  <ol>
    {#each $jobs as job}
      <!-- content here -->
      <Job jobId={job.id} />
    {/each}
  </ol>
</div>
