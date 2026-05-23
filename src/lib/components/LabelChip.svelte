<script lang="ts">
  import type { Label } from '../types'

  interface Props {
    label: Label
    removable?: boolean
    onremove?: () => void
  }

  let { label, removable = false, onremove }: Props = $props()
</script>

<span
  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white leading-none"
  style="background-color: {label.color}"
>
  {label.name}
  {#if removable}
    <button
      onclick={onremove}
      class="hover:opacity-70 transition-opacity ml-0.5 leading-none"
      aria-label="Remove {label.name}"
      type="button"
    >
      <svg class="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor">
        <path d="M1.5 1.5 8.5 8.5M8.5 1.5 1.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  {/if}
</span>
