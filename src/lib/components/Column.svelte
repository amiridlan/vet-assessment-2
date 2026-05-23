<script lang="ts">
  import Sortable from 'sortablejs'
  import { board } from '../stores/board.svelte'
  import type { Column } from '../types'
  import TaskCard from './TaskCard.svelte'

  interface Props {
    column: Column
  }

  let { column }: Props = $props()

  const tasks = $derived(
    board.tasks
      .filter(t => t.columnId === column.id)
      .sort((a, b) => a.order - b.order)
  )

  const filteredIds = $derived(board.filteredTaskIds)

  let isEditing = $state(false)
  let editTitle = $state('')
  let addingTask = $state(false)
  let newTaskTitle = $state('')
  let listEl: HTMLElement | undefined = $state()

  $effect(() => {
    if (!listEl) return
    const sortable = Sortable.create(listEl, {
      group: 'tasks',
      animation: 150,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      handle: '.task-card',
      onEnd(evt) {
        const fromColId = evt.from.dataset.columnId!
        const toColId = evt.to.dataset.columnId!
        const movedId = evt.item.dataset.taskId!
        const newOrder = Array.from(evt.to.children)
          .map(el => (el as HTMLElement).dataset.taskId!)
          .filter(Boolean)
        if (fromColId !== toColId) {
          board.moveTask(movedId, toColId, newOrder)
          // also fix source column order
          const srcOrder = Array.from(evt.from.children)
            .map(el => (el as HTMLElement).dataset.taskId!)
            .filter(Boolean)
          board.reorderTasksInColumn(fromColId, srcOrder)
        } else {
          board.reorderTasksInColumn(toColId, newOrder)
        }
      },
    })
    return () => sortable.destroy()
  })

  function startEdit() {
    editTitle = column.title   // capture current title at edit start
    isEditing = true
  }

  function commitEdit() {
    const t = editTitle.trim()
    if (t) board.renameColumn(column.id, t)
    isEditing = false
  }

  function handleEditKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') isEditing = false
  }

  function submitNewTask() {
    const t = newTaskTitle.trim()
    if (t) board.addTask(column.id, t)
    newTaskTitle = ''
    addingTask = false
  }

  function handleNewTaskKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') submitNewTask()
    if (e.key === 'Escape') { addingTask = false; newTaskTitle = '' }
  }

  function confirmDeleteColumn() {
    const taskCount = tasks.length
    const msg = taskCount > 0
      ? `Delete "${column.title}"? It contains ${taskCount} task${taskCount > 1 ? 's' : ''} which will also be deleted.`
      : `Delete column "${column.title}"?`
    if (confirm(msg)) board.deleteColumn(column.id)
  }
</script>

<div class="column flex flex-col w-72 shrink-0 bg-slate-100 rounded-xl" data-column-id={column.id}>
  <!-- Column header -->
  <div class="flex items-center justify-between px-3 pt-3 pb-2">
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <div class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: {column.color}"></div>
      {#if isEditing}
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          bind:value={editTitle}
          autofocus
          onblur={commitEdit}
          onkeydown={handleEditKeydown}
          class="flex-1 text-sm font-semibold bg-white border border-indigo-400 rounded-md px-2 py-0.5 focus:outline-none"
        />
      {:else}
        <button
          type="button"
          ondblclick={startEdit}
          class="text-sm font-semibold text-slate-700 truncate hover:text-indigo-600 transition-colors text-left"
          title="Double-click to rename"
        >
          {column.title}
        </button>
      {/if}
    </div>

    <div class="flex items-center gap-1 shrink-0">
      <span class="text-xs font-medium text-slate-400 bg-slate-200 rounded-full px-2 py-0.5">
        {tasks.length}
      </span>
      <button
        type="button"
        onclick={confirmDeleteColumn}
        class="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
        aria-label="Delete column"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Task list (SortableJS target) -->
  <div
    bind:this={listEl}
    data-column-id={column.id}
    class="flex-1 px-2 pb-2 space-y-2 min-h-12 overflow-y-auto max-h-[calc(100vh-220px)]"
  >
    {#each tasks as task (task.id)}
      <div data-task-id={task.id}>
        <TaskCard {task} dimmed={filteredIds !== null && !filteredIds.has(task.id)} />
      </div>
    {/each}

    {#if tasks.length === 0}
      <div class="text-center py-6 text-xs text-slate-400 select-none pointer-events-none">
        No tasks yet
      </div>
    {/if}
  </div>

  <!-- Add task -->
  <div class="px-2 pb-2">
    {#if addingTask}
      <div class="bg-white rounded-lg border border-indigo-300 p-2 shadow-sm">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          bind:value={newTaskTitle}
          autofocus
          placeholder="Task title..."
          onkeydown={handleNewTaskKeydown}
          onblur={() => { if (!newTaskTitle.trim()) { addingTask = false } }}
          class="w-full text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
        />
        <div class="flex gap-2 mt-2">
          <button
            type="button"
            onclick={submitNewTask}
            class="text-xs px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors font-medium"
          >
            Add
          </button>
          <button
            type="button"
            onclick={() => { addingTask = false; newTaskTitle = '' }}
            class="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    {:else}
      <button
        type="button"
        onclick={() => addingTask = true}
        class="w-full text-left text-xs text-slate-500 hover:text-indigo-600 hover:bg-white
          px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 group"
      >
        <svg class="w-3.5 h-3.5 group-hover:text-indigo-500" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
        </svg>
        Add task
      </button>
    {/if}
  </div>
</div>
