<script>
  import { stores } from "../stores";
  const { notesEditor, notes } = stores();
  let editorRange;
  function buttonAction(type) {
    document.execCommand(type, false, "");
    notesEditor.update(config => {
      config[type] = !config[type];
      return { ...config };
    });
  }
  let visible = false
  $: if ($notesEditor.editor) {
    visible = true
  } else {
    visible = false
  }
  export let collection = false;
</script>

<style>
  .NotesBar {
    display: block;
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--sidebar-background-color);
    z-index: 3;
    line-height: 1;
    padding: 0.25rem 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    grid-area: notesbar;
  }
  .NotesBar.collection {
    background-color: var(--main-background-color);
  }
  .Button {
    font-family: var(--sans-fonts);
    font-weight: 400;
    flex: 0 1 auto;
    line-height: 1.2;

    display: inline-block;
    padding: 0;
    margin: 3px 3px 0 3px;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;

    color: var(--link);
    border: none;
    background-color: transparent;

    -ms-touch-action: manipulation;
    touch-action: manipulation;
    text-transform: uppercase;
    font-size: 0.65rem;
    border-radius: 0.1rem;
  }
  .Button:hover {
    color: var(--hover);
    text-decoration: none;
    box-shadow: none;
  }

  .Button:active,
  .Button.active {
    color: white;
    background-color: var(--rc-dark);
  }

  .Button:focus {
    box-shadow: 0 0 0 3px var(--rc-medium);
  }

  .Button:focus {
    outline: solid transparent;
  }
  .buttons {
    visibility: hidden;
  }
  .buttons.visible {
    visibility: visible;
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="NotesBar" class:collection>
  {#if $notes.items || collection}
    <span class:visible class="buttons">
      <button
        class="Button"
        type="button"
        aria-label="Bold"
        class:active={$notesEditor.bold}
        on:mousedown={event => {
          event.preventDefault();
        }}
        on:click={event => {
          buttonAction('bold');
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      </button>

      <button
        class="Button"
        type="button"
        aria-label="Italic"
        class:active={$notesEditor.italic}
        on:mousedown={event => {
          event.preventDefault();
        }}
        on:click={event => {
          buttonAction('italic');
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M19 4h-9M14 20H5M14.7 4.7L9.2 19.4" />
        </svg>
      </button>
    </span>
    <span />
    <span />
  {/if}
</div>
