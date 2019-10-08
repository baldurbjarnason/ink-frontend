<script context="module">
  export async function preload(page, session) {
    let recent;
    if (session.user && session.user.id) {
      recent = await this.fetch(`/recent.json`, { credentials: "include" })
        .then(response => response.json())
        .catch(err => this.error(err));
    }
    return { recent };
  }
</script>

<script>
  import Toolbar from "../components/Toolbar.svelte";
  import Uploader from "../uploader/Upload.svelte";
  import UploadQueue from "../uploader/UploadQueue.svelte";
  import { uploadQueue } from "../uploader/upload-doc.js";
  import Recent from "../uploader/Recent.svelte";
  import { onMount } from "svelte";
  import { profile } from "./_profile.js";
  import { open } from "../actions/modal.js";
  import { fly } from 'svelte/transition';
  import {title, leftSidebar} from "../stores/layout.js"
  title.set("Uploads")
  leftSidebar.set('collections')
  export let recent;
  function fileDrop(files) {
    for (let file of files) {
      uploadQueue.add(file);
    }
  }
  $: if ($uploadQueue) {
    fetch(`/recent.json`)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return {}
        }
      })
      .then(json => {
        recent = json;
      });
  }
</script>

<style>
  .Front {
    padding: var(--reader-left-margin);
  }

  @media (min-width: 480px) {
  }
</style>

<svelte:head>
  <title>Uploads – Rebus Ink</title>
</svelte:head>
<div class="Front" in:fly="{{ y: 200, duration:250, delay: 250}}" out:fly="{{ y: 200, duration:250}}">
  <!-- Uploader -->
  <Uploader upload={fileDrop} />
  {#if uploadQueue}
    <UploadQueue queue={uploadQueue} />
  {/if}
  <!-- Recent -->
  {#if recent}
    <Recent {recent} />
  {/if}
</div>
