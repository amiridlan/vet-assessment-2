<script lang="ts">
  import type { User } from '../types'

  interface Props {
    user: User | null
    size?: 'sm' | 'md'
    showTooltip?: boolean
  }

  let { user, size = 'sm', showTooltip = true }: Props = $props()

  const dim = $derived(size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs')
</script>

{#if user}
  <div
    class="{dim} rounded-full flex items-center justify-center font-bold text-white shrink-0 cursor-default select-none"
    style="background-color: {user.color}"
    title={showTooltip ? user.name : undefined}
    aria-label={user.name}
  >
    {user.initials}
  </div>
{:else}
  <div
    class="{dim} rounded-full flex items-center justify-center bg-slate-200 shrink-0"
    title="Unassigned"
    aria-label="Unassigned"
  >
    <svg class="w-3 h-3 text-slate-400" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-1 1a4 4 0 0 0-4 4v.5a.5.5 0 0 0 1 0V13a3 3 0 0 1 6 0v.5a.5.5 0 0 0 1 0V13a4 4 0 0 0-4-4H7Z"/>
    </svg>
  </div>
{/if}
