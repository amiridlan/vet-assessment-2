<script lang="ts">
  import { board } from './lib/stores/board.svelte'
  import Board from './lib/components/Board.svelte'
  import FilterBar from './lib/components/FilterBar.svelte'
  import TaskModal from './lib/components/TaskModal.svelte'

  let importInput: HTMLInputElement | undefined = $state()

  function handleImport(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) board.importBoard(file)
    if (importInput) importInput.value = ''
  }
</script>

<div class="flex flex-col h-screen overflow-hidden">
  <!-- Top navbar -->
  <header class="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 shadow-sm">
    <div class="flex items-center gap-3">
      <div class="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
        <svg class="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2ZM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7Z"/>
        </svg>
      </div>
      <h1 class="text-base font-bold text-slate-800">Team-Ready Kanban</h1>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        onclick={() => importInput?.click()}
        class="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600
          px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
        </svg>
        Import
      </button>
      <input
        bind:this={importInput}
        type="file"
        accept=".json"
        onchange={handleImport}
        class="hidden"
      />

      <button
        type="button"
        onclick={() => board.exportBoard()}
        class="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600
          px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
        </svg>
        Export
      </button>
    </div>
  </header>

  <!-- Filter bar -->
  <FilterBar />

  <!-- Board scroll area -->
  <main class="flex-1 overflow-x-auto overflow-y-hidden">
    <Board />
  </main>
</div>

<!-- Task detail modal (portal-like, rendered at root) -->
<TaskModal />
