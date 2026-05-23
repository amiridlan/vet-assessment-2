<script lang="ts">
  import Sortable from 'sortablejs'
  import { board } from '../stores/board.svelte'
  import Column from './Column.svelte'

  let addingColumn = $state(false)
  let newColumnTitle = $state('')
  let boardEl: HTMLElement | undefined = $state()

  $effect(() => {
    if (!boardEl) return
    const sortable = Sortable.create(boardEl, {
      animation: 200,
      handle: '.column',
      draggable: '.column',
      ghostClass: 'sortable-ghost',
      onEnd(evt) {
        const newOrder = Array.from(evt.to.children)
          .map(el => (el as HTMLElement).dataset.columnId!)
          .filter(Boolean)
        board.reorderColumns(newOrder)
      },
    })
    return () => sortable.destroy()
  })

  function submitNewColumn() {
    const t = newColumnTitle.trim()
    if (t) board.addColumn(t)
    newColumnTitle = ''
    addingColumn = false
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') submitNewColumn()
    if (e.key === 'Escape') { addingColumn = false; newColumnTitle = '' }
  }
</script>

<div
  bind:this={boardEl}
  class="flex gap-4 items-start px-4 py-4 min-h-full w-max"
>
  {#each board.columns as column (column.id)}
    <div data-column-id={column.id}>
      <Column {column} />
    </div>
  {/each}

  <!-- Add column -->
  <div class="w-72 shrink-0">
    {#if addingColumn}
      <div class="bg-slate-100 rounded-xl p-3">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          bind:value={newColumnTitle}
          autofocus
          placeholder="Column title..."
          onkeydown={handleKeydown}
          onblur={() => { if (!newColumnTitle.trim()) addingColumn = false }}
          class="w-full text-sm font-medium bg-white border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none"
        />
        <div class="flex gap-2 mt-2">
          <button
            type="button"
            onclick={submitNewColumn}
            class="text-xs px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors font-medium"
          >
            Add column
          </button>
          <button
            type="button"
            onclick={() => { addingColumn = false; newColumnTitle = '' }}
            class="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    {:else}
      <button
        type="button"
        onclick={() => addingColumn = true}
        class="w-full flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600
          bg-slate-100/60 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-indigo-300
          rounded-xl px-4 py-3 transition-all group"
      >
        <svg class="w-4 h-4 group-hover:text-indigo-500" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
        </svg>
        Add column
      </button>
    {/if}
  </div>
</div>
