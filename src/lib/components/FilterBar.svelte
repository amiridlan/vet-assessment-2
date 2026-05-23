<script lang="ts">
  import { board } from '../stores/board.svelte'
  import { PRIORITY_COLORS } from '../constants'
  import type { Priority } from '../types'
  import UserAvatar from './UserAvatar.svelte'

  const priorities: Priority[] = ['low', 'medium', 'high', 'critical']

  const hasActiveFilters = $derived(
    board.filters.assigneeIds.length > 0 ||
    board.filters.labelIds.length > 0 ||
    board.filters.priorities.length > 0
  )
</script>

<div class="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-white border-b border-slate-200">
  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide shrink-0">Filter</span>

  <!-- Assignee filters -->
  <div class="flex items-center gap-1.5">
    {#each board.users as user (user.id)}
      <button
        type="button"
        onclick={() => board.toggleFilterAssignee(user.id)}
        class="rounded-full transition-all hover:scale-110
          {board.filters.assigneeIds.includes(user.id) ? 'ring-2 ring-indigo-400 ring-offset-1 scale-110' : 'opacity-60 hover:opacity-100'}"
        title={user.name}
        aria-pressed={board.filters.assigneeIds.includes(user.id)}
      >
        <UserAvatar {user} size="sm" showTooltip={false} />
      </button>
    {/each}
  </div>

  <div class="w-px h-5 bg-slate-200 shrink-0"></div>

  <!-- Priority filters -->
  <div class="flex items-center gap-1.5">
    {#each priorities as p}
      <button
        type="button"
        onclick={() => board.toggleFilterPriority(p)}
        class="text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all
          {board.filters.priorities.includes(p)
            ? 'text-white border-transparent'
            : 'border-slate-200 text-slate-500 hover:border-slate-300'}"
        style={board.filters.priorities.includes(p) ? `background-color: ${PRIORITY_COLORS[p]}; border-color: ${PRIORITY_COLORS[p]}` : ''}
        aria-pressed={board.filters.priorities.includes(p)}
      >
        {p.charAt(0).toUpperCase() + p.slice(1)}
      </button>
    {/each}
  </div>

  <div class="w-px h-5 bg-slate-200 shrink-0"></div>

  <!-- Label filters -->
  <div class="flex flex-wrap items-center gap-1.5">
    {#each board.labels as label (label.id)}
      <button
        type="button"
        onclick={() => board.toggleFilterLabel(label.id)}
        class="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white transition-all
          {board.filters.labelIds.includes(label.id) ? 'ring-2 ring-offset-1 ring-slate-400 scale-105' : 'opacity-60 hover:opacity-100'}"
        style="background-color: {label.color}"
        aria-pressed={board.filters.labelIds.includes(label.id)}
      >
        {label.name}
      </button>
    {/each}
  </div>

  {#if hasActiveFilters}
    <button
      type="button"
      onclick={() => board.clearFilters()}
      class="ml-auto text-xs text-indigo-500 hover:text-indigo-700 font-medium shrink-0 transition-colors"
    >
      Clear all
    </button>
  {/if}
</div>
