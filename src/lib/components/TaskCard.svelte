<script lang="ts">
  import { board } from '../stores/board.svelte'
  import { PRIORITY_COLORS } from '../constants'
  import type { Task } from '../types'
  import UserAvatar from './UserAvatar.svelte'
  import LabelChip from './LabelChip.svelte'

  interface Props {
    task: Task
    dimmed?: boolean
  }

  let { task, dimmed = false }: Props = $props()

  const assignee = $derived(board.users.find(u => u.id === task.assigneeId) ?? null)
  const taskLabels = $derived(board.labels.filter(l => task.labelIds.includes(l.id)))
  const priorityColor = $derived(PRIORITY_COLORS[task.priority])

  const isOverdue = $derived(() => {
    if (!task.dueDate) return false
    return new Date(task.dueDate) < new Date(new Date().toDateString())
  })

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
</script>

<div
  role="button"
  tabindex="0"
  class="task-card bg-white rounded-lg shadow-sm border border-slate-200 p-3 cursor-pointer
    hover:shadow-md hover:border-indigo-300 active:scale-[0.99]
    transition-all duration-150 select-none
    {dimmed ? 'opacity-30 pointer-events-none' : ''}"
  onclick={() => board.openModal(task.id)}
  onkeydown={e => e.key === 'Enter' && board.openModal(task.id)}
  aria-label="Open task: {task.title}"
>
  <!-- Priority bar -->
  <div
    class="w-full h-0.5 rounded-full mb-2.5"
    style="background-color: {priorityColor}"
  ></div>

  <!-- Labels -->
  {#if taskLabels.length > 0}
    <div class="flex flex-wrap gap-1 mb-2">
      {#each taskLabels as label (label.id)}
        <LabelChip {label} />
      {/each}
    </div>
  {/if}

  <!-- Title -->
  <p class="text-sm font-medium text-slate-800 leading-snug line-clamp-2 mb-2">
    {task.title}
  </p>

  <!-- Footer: due date + assignee -->
  <div class="flex items-center justify-between mt-1">
    {#if task.dueDate}
      <span class="text-[11px] flex items-center gap-1 {isOverdue() ? 'text-red-500 font-medium' : 'text-slate-400'}">
        <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5ZM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2Zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5Z"/>
        </svg>
        {formatDate(task.dueDate)}
      </span>
    {:else}
      <span></span>
    {/if}
    <UserAvatar user={assignee} size="sm" />
  </div>
</div>
