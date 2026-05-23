<script lang="ts">
  import { board } from '../stores/board.svelte'
  import { LABEL_COLORS, PRIORITY_COLORS } from '../constants'
  import type { Priority } from '../types'
  import UserAvatar from './UserAvatar.svelte'
  import LabelChip from './LabelChip.svelte'

  const task = $derived(board.openTask)

  let newLabelName = $state('')
  let newLabelColor = $state(LABEL_COLORS[0])
  let showLabelCreator = $state(false)

  const taskLabels = $derived(
    task ? board.labels.filter(l => task.labelIds.includes(l.id)) : []
  )
  const assignee = $derived(
    task ? board.users.find(u => u.id === task.assigneeId) ?? null : null
  )

  const priorities: Priority[] = ['low', 'medium', 'high', 'critical']

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) board.closeModal()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') board.closeModal()
  }

  function confirmDelete() {
    if (!task) return
    if (confirm(`Delete "${task.title}"?`)) {
      board.deleteTask(task.id)
      board.closeModal()
    }
  }

  function handleCreateLabel() {
    const name = newLabelName.trim()
    if (!name || !task) return
    const label = board.addLabel(name, newLabelColor)
    board.updateTask(task.id, { labelIds: [...task.labelIds, label.id] })
    newLabelName = ''
    showLabelCreator = false
  }

  function toggleLabel(labelId: string) {
    if (!task) return
    const has = task.labelIds.includes(labelId)
    board.updateTask(task.id, {
      labelIds: has ? task.labelIds.filter(id => id !== labelId) : [...task.labelIds, labelId]
    })
  }

  // Trap focus inside modal
  function trapFocus(node: HTMLElement) {
    const focusable = () => Array.from(
      node.querySelectorAll<HTMLElement>('button,input,select,textarea,[tabindex]:not([tabindex="-1"])')
    )
    function onKeydown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const els = focusable()
      if (!els.length) return
      const first = els[0], last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    node.addEventListener('keydown', onKeydown)
    focusable()[0]?.focus()
    return { destroy() { node.removeEventListener('keydown', onKeydown) } }
  }
</script>

{#if task}
  <div
    class="modal-backdrop fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-labelledby="modal-title"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
  >
    <div
      class="modal-panel bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      use:trapFocus
    >
      <!-- Header -->
      <div class="flex items-start justify-between p-5 border-b border-slate-100">
        <input
          id="modal-title"
          type="text"
          value={task.title}
          oninput={e => board.updateTask(task.id, { title: (e.target as HTMLInputElement).value })}
          class="text-lg font-semibold text-slate-800 flex-1 mr-3 bg-transparent border-b-2 border-transparent
            hover:border-slate-200 focus:border-indigo-400 focus:outline-none transition-colors py-0.5"
          placeholder="Task title"
        />
        <button
          onclick={() => board.closeModal()}
          class="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 shrink-0"
          aria-label="Close modal"
        >
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
          </svg>
        </button>
      </div>

      <div class="p-5 space-y-5">
        <!-- Description -->
        <div>
          <label for="modal-desc" class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
          <textarea
            id="modal-desc"
            value={task.description}
            oninput={e => board.updateTask(task.id, { description: (e.target as HTMLTextAreaElement).value })}
            rows="3"
            placeholder="Add a description..."
            class="w-full text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2
              focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
              resize-none transition-colors"
          ></textarea>
        </div>

        <!-- Priority + Due Date -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="modal-priority" class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Priority</label>
            <select
              id="modal-priority"
              value={task.priority}
              onchange={e => board.updateTask(task.id, { priority: (e.target as HTMLSelectElement).value as Priority })}
              class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white
                focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors"
            >
              {#each priorities as p}
                <option value={p} style="color: {PRIORITY_COLORS[p]}">
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              {/each}
            </select>
          </div>
          <div>
            <label for="modal-due" class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Due Date</label>
            <input
              id="modal-due"
              type="date"
              value={task.dueDate ?? ''}
              onchange={e => board.updateTask(task.id, { dueDate: (e.target as HTMLInputElement).value || null })}
              class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white
                focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors"
            />
          </div>
        </div>

        <!-- Assignee -->
        <div>
          <span class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Assignee</span>
          <div class="flex flex-wrap gap-2">
            {#each board.users as user (user.id)}
              <button
                type="button"
                onclick={() => board.updateTask(task.id, { assigneeId: task.assigneeId === user.id ? null : user.id })}
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all
                  {task.assigneeId === user.id
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'}"
                title={user.name}
              >
                <UserAvatar {user} size="sm" showTooltip={false} />
                {user.name.split(' ')[0]}
              </button>
            {/each}
            {#if task.assigneeId}
              <button
                type="button"
                onclick={() => board.updateTask(task.id, { assigneeId: null })}
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
              >
                Unassign
              </button>
            {/if}
          </div>
        </div>

        <!-- Labels -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Labels</span>
            <button
              type="button"
              onclick={() => showLabelCreator = !showLabelCreator}
              class="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
            >
              + New label
            </button>
          </div>

          {#if showLabelCreator}
            <div class="flex gap-2 mb-3 p-3 bg-slate-50 rounded-lg">
              <input
                type="text"
                bind:value={newLabelName}
                placeholder="Label name"
                onkeydown={e => e.key === 'Enter' && handleCreateLabel()}
                class="flex-1 text-sm border border-slate-200 rounded-md px-2.5 py-1.5
                  focus:outline-none focus:border-indigo-400 transition-colors"
              />
              <div class="flex gap-1 items-center">
                {#each LABEL_COLORS as color}
                  <button
                    type="button"
                    onclick={() => newLabelColor = color}
                    class="w-5 h-5 rounded-full transition-transform hover:scale-110
                      {newLabelColor === color ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : ''}"
                    style="background-color: {color}"
                    aria-label="Color {color}"
                  ></button>
                {/each}
              </div>
              <button
                type="button"
                onclick={handleCreateLabel}
                class="px-3 py-1.5 bg-indigo-500 text-white text-xs font-medium rounded-md hover:bg-indigo-600 transition-colors"
              >
                Add
              </button>
            </div>
          {/if}

          <div class="flex flex-wrap gap-1.5">
            {#each board.labels as label (label.id)}
              <button
                type="button"
                onclick={() => toggleLabel(label.id)}
                class="transition-all {task.labelIds.includes(label.id) ? 'ring-2 ring-offset-1 ring-slate-400 scale-105' : 'opacity-60 hover:opacity-100'}"
                title="{task.labelIds.includes(label.id) ? 'Remove' : 'Add'} {label.name}"
              >
                <LabelChip {label} />
              </button>
            {/each}
            {#if board.labels.length === 0}
              <span class="text-xs text-slate-400">No labels yet. Create one above.</span>
            {/if}
          </div>
        </div>

        <!-- Meta -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
          <button
            type="button"
            onclick={confirmDelete}
            class="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50
              px-2.5 py-1.5 rounded-lg transition-all"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
            </svg>
            Delete task
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
