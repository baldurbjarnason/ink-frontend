<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { stores } from "../stores";
  import { fade } from "svelte/transition";
  import ChapterBody from "./ChapterBody.svelte";
  const {
    docStore,
    chapterStore,
    navigation,
    contents,
    currentLocation,
    theme,
    fontSize
  } = stores();
  const dispatch = createEventDispatcher();
  let { url, index } = $chapterStore;
  let positionObserver;
  let locationObserver;
  let highest;
  let chapterElement;
  export let chapterIndex;
  onMount(() => {
    if (!positionObserver) {
      positionObserver = new window.IntersectionObserver(onPosition, {
        rootMargin: "-15% 0px -75% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      });
    }
    if (!locationObserver) {
      locationObserver = new window.IntersectionObserver(onLocation, {
        rootMargin: "15% 0px 75% 0px",
        threshold: [0]
      });
    }
    function onPosition(entries) {
      if (entries[0].target !== highest) {
        highest = entries[0].target;
        dispatch("current", {
          highest
        });
      }
    }
    function onLocation(entries) {
      const nodes = entries.map(entry => {
        locationObserver.unobserve(entry.target);
        const { target, boundingClientRect } = entry;
        const { top, left, width, height } = boundingClientRect;
        return {
          target,
          top,
          width,
          height,
          location: target.dataset.location
        };
      });
      dispatch("appearing", {
        nodes
      });
    }
  });
  onDestroy(() => {
    if (positionObserver) positionObserver.disconnect();
    if (locationObserver) locationObserver.disconnect();
  });
  function handleIntroEnd() {
    window.requestAnimationFrame(() => {});
  }
  $: if (chapterElement) {
    chapterElement.querySelectorAll("[data-location]").forEach(element => {
      positionObserver.observe(element);
      locationObserver.observe(element);
    });
  }
</script>

<style>
  .Chapter {
    all: initial;
    position: relative;
    line-height: var(--reader-line-height);
    font-size: var(--reader-font-size);
    color: var(--reader-text-color);
    font-family: var(--reader-font-family);
    background-color: var(--reader-background-color);
    line-height: var(--reader-line-height);
    display: block;
    contain: content;
    padding: 0;
    display: grid;
    grid-template-columns:
      minmax(var(--reader-left-margin), 1fr) minmax(
        var(--reader-min-column-width),
        var(--reader-max-column-width)
      )
      minmax(var(--reader-left-margin), 1fr);
    grid-template-areas: "leftmargin maintext rightmargin";
    grid-row-gap: var(--reader-paragraph-spacing);
    min-height: 100vh;
  }
  .ChapterNotes {
    grid-area: rightmargin;
    margin-left: var(--reader-left-margin);
    background-color: #fefefe;
  }
  :global(.Chapter > *) {
    grid-column: 2 / 3;
    margin: 0 auto;
    max-width: 100%;
  }
  :global(.Bookmarked) {
    position: relative;
  }
  :global(.Bookmarked)::after {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -50vw;
    display: block;
    top: 0;
    height: 2.5rem;
    border-left: 0.75rem solid #b4312e;
    border-bottom: 0.75rem solid transparent;
  }
  /* :global(.Highlight.Commented)::after {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -50vw;
    display: block;
    top: 0;
    height: 1.25rem;
    border-left: 1.25rem solid #b4312e;
  } */

  :global(.Chapter .Highlight) {
    background-color: #ffff98;
  }

  :global(.Chapter .Highlight--selected) {
    background-color: #ddddd0;
  }

  :global(.Chapter [hidden]),
  :global(.Chapter template) {
    display: none !important;
  }
  :global(.Chapter head) {
    display: none;
  }

  :global(.Chapter blockquote) {
    margin-left: 2.5em;
  }

  :global(.Chapter blockquote),
  :global(.Chapter blockquote p) {
    font-size: 0.75rem;
    font-size: calc(var(--reader-font-size) * 0.85);
    line-height: 1.2;
  }

  :global(.Chapter blockquote * + *) {
    margin-top: calc(var(--reader-paragraph-spacing) * 0.85);
  }
  :global(.Chapter blockquote *) {
    margin-bottom: 0;
  }
  :global(.Chapter blockquote :first-child) {
    margin: 0;
  }
  :global(.Chapter h1) {
    font-size: 2em;
    font-size: calc(var(--reader-font-size) * 3);
    font-weight: 600;
    margin: 0;
  }

  :global(.Chapter h2) {
    font-weight: 600;
    font-size: calc(var(--reader-font-size) * 2);
    margin: 0;
  }
  :global(.Chapter h3) {
    font-weight: 400;
    font-style: italic;
    font-size: calc(var(--reader-font-size) * 1.5);
    margin: 0;
  }
  :global(.Chapter h4) {
    font-weight: normal;
    font-size: calc(var(--reader-font-size) * 1.25);
    margin: 0;
  }
  :global(.Chapter h5) {
    font-weight: normal;
    font-size: var(--reader-font-size);
    text-transform: uppercase;
    margin: 0;
  }

  :global(.Chapter h6) {
    font-weight: normal;
    font-size: var(--reader-font-size);
    margin: 0;
  }

  :global(.Chapter h1),
  :global(.Chapter h2),
  :global(.Chapter h3),
  :global(.Chapter h4),
  :global(.Chapter h5),
  :global(.Chapter h6) {
    margin: 0;
  }

  :global(.Chapter p),
  :global(.Chapter td),
  :global(.Chapter figure),
  :global(.Chapter figcaption) {
    line-height: var(--reader-line-height);
    font-size: 0.85rem;
    font-size: var(--reader-font-size, 0.85rem);
  }

  :global(.Chapter a[href]) {
    transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
      transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
    text-decoration: underline;
  }
  :global(.Chapter :link) {
    color: var(--link);
  }
  :global(.Chapter :visited) {
    color: var(--visited);
  }
  :global(.Chapter a:link:hover) {
    color: var(--hover);
  }
  :global(.Chapter a) {
    border-radius: 0;
  }
  @keyframes readableChapterPop {
    0% {
      box-shadow: 0 0 0 1px rgb(228, 255, 254, 0.2);
      background-color: rgb(228, 255, 254, 0.2);
      transform: scale(0.5);
    }
    50% {
      box-shadow: 0 0 0 8px var(--rc-lighter);
      transform: scale(1.5);
    }
    100% {
      box-shadow: 0 0 0 3px var(--rc-lighter);
      background-color: var(--rc-lighter);
      transform: scale(1);
    }
  }
  :global(.Highlight.Commented) {
    position: relative;
    border-bottom: 0.125rem solid #eded00;
  }
  :global(.Chapter a.Highlight), :global(.Chapter mark.Highlight) {
    background-color: #feff9c;
    box-shadow: 0 0 0 2px #feff9c;
    color: var(--reader-text-color);
    text-decoration: none;
    border-radius: 0;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="1"]) {
    background-color: #7afcff;
    box-shadow: 0 0 0 2px #7afcff;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="2"]) {
    background-color: #ff65a3;
    box-shadow: 0 0 0 2px #ff65a3;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="3"]) {
    background-color: #fff740;
    box-shadow: 0 0 0 2px #fff740;
  }
  :global(.Chapter a.Highlight:hover), :global(.Chapter mark.Highlight:hover) {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 3px var(--rc-lighter);
    color: var(--reader-text-color);
    text-decoration: none;
    border-radius: 0;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="1"]:hover) {
    background-color: var(--rc-light);
    box-shadow: 0 0 0 3px var(--rc-light);
  }
  :global(.Chapter mark.Highlight[data-highlight-level="2"]:hover) {
    background-color: #ff7eb9;
    box-shadow: 0 0 0 3px #ff7eb9;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="3"]:hover) {
    background-color: #feff9c;
    box-shadow: 0 0 0 3px #feff9c;
  }

  :global(.Chapter mark::before), 
  :global(.Chapter mark::after), :global(.Chapter a.Highlight::before), 
  :global(.Chapter a.Highlight::after) {
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  :global(.Chapter mark::before), :global(.Chapter a.Highlight::before) {
    content: " [highlight start] ";
  }

  :global(.Chapter mark::after), :global(.Chapter a.Highlight::after) {
    content: " [highlight end] ";
  }
  :global(.Chapter a:focus) {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 5px var(--rc-lighter);
    outline: solid transparent;
    animation: readableChapterPop 0.25s ease-in-out;
  }

  :global(.Chapter a:link:active) {
    color: var(--active);
  }
  :global(.Chapter b),
  :global(.Chapter strong),
  :global(.Chapter b > *),
  :global(.Chapter strong > *) {
    font-weight: 600;
  }
  :global(.Chapter svg),
  :global(.Chapter img) {
    max-height: 88vh;
    width: auto;
    height: auto;
    max-width: 100%;
  }
  :global(.Chapter .is-current) {
    background-color: #f9f9f9;
    box-shadow: 0 0 0 0.25rem #f9f9f9;
  }
  :global(p, ol, ul, dl, blockquote, figure, table, hr, section, article, details, figcaption) {
    margin-top: var(--reader-paragraph-spacing);
    margin-bottom: var(--reader-paragraph-spacing);
  }
</style>

{#if $docStore && $chapterStore && $chapterStore.index === chapterIndex}
  <div class="Chapter" bind:this={chapterElement} on:introend={handleIntroEnd}>
    <ChapterBody html={$chapterStore.html} />
    <div class="ChapterNotes" />
  </div>
{/if}
