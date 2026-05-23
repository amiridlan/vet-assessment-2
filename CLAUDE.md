# Team-Ready Kanban Board — CLAUDE.md

## Project Overview
A fully client-side Kanban board application with advanced project management features.
No backend, no cloud service — all state lives in the browser via localStorage.

## Tech Stack
| Layer | Tool | Version |
|-------|------|---------|
| UI Framework | Svelte 5 | ^5.x (runes mode) |
| Language | TypeScript | ^5.x (strict) |
| Build Tool | Vite | ^6.x |
| Styling | Tailwind CSS | v4 (CSS-first config) |
| Drag & Drop | SortableJS | ^1.15 |
| Persistence | Browser localStorage | native |

## Project Structure
```
vet-assessment-2/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Board.svelte          # Root board container
│   │   │   ├── Column.svelte         # Kanban column with header + cards
│   │   │   ├── TaskCard.svelte       # Draggable card (compact view)
│   │   │   ├── TaskModal.svelte      # Full task detail/edit modal
│   │   │   ├── FilterBar.svelte      # Filter controls toolbar
│   │   │   ├── LabelChip.svelte      # Reusable label/tag chip
│   │   │   └── UserAvatar.svelte     # Assignee avatar circle
│   │   ├── stores/
│   │   │   └── board.svelte.ts       # Svelte 5 rune-based state store
│   │   ├── types.ts                  # All TypeScript interfaces
│   │   ├── constants.ts              # Default users, colors, initial board data
│   │   └── persistence.ts            # localStorage read/write helpers
│   ├── app.css                       # Tailwind v4 import + CSS custom properties
│   └── main.ts                       # App entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md
└── README.md
```

## Key Architectural Decisions

### Svelte 5 Runes State
- All board state is managed in `src/lib/stores/board.svelte.ts` using `$state()` runes
- State shape: `{ columns: Column[], labels: Label[], activeFilters: FilterState }`
- Every mutation triggers an `$effect()` that debounces localStorage writes

### SortableJS Integration
- SortableJS is mounted via a Svelte `use:action` on each `.column-body` element
- On `onEnd`, the action reads the new DOM order, computes the diff, and updates `$state`
- Column reordering uses a separate Sortable instance on the `.board` element

### Data Types (src/lib/types.ts)
```typescript
interface Task {
  id: string;           // crypto.randomUUID()
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string | null;  // ISO date string
  assigneeId: string | null;
  labelIds: string[];
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Column {
  id: string;
  title: string;
  order: number;
  color: string;        // accent color for column header
}

interface Label {
  id: string;
  name: string;
  color: string;        // hex color
}

interface User {
  id: string;
  name: string;
  initials: string;
  color: string;        // avatar background color
}
```

### LocalStorage Schema
- Key: `kanban-board-v1`
- Value: `{ version: 1, columns: Column[], tasks: Task[], labels: Label[] }`
- Version key allows future migrations without silent data corruption

### Filtering Logic
- Filters are applied as `$derived()` in the store: `filteredTasks = $derived(...)`
- Filters are AND-combined (task must match all active filters)
- Unmatched cards receive `opacity-30 pointer-events-none` classes (not removed from DOM)

## Tailwind v4 Notes
- No `tailwind.config.js` — configuration is in `app.css` using `@theme` directive
- Import: `@import "tailwindcss"` at top of `app.css`
- Custom colors defined as CSS custom properties under `@theme {}`

## Sprint Reference
See sprint plan in README.md. Sprint stories map to these components:
- KB-01 → scaffolding (package.json, vite.config.ts, tsconfig.json)
- KB-02 → Board.svelte + Column.svelte (layout only)
- KB-03 → TaskCard.svelte
- KB-04 → SortableJS action in Column.svelte + Board.svelte
- KB-05 → CRUD mutations in board.svelte.ts
- KB-06 → TaskModal.svelte
- KB-07 → UserAvatar.svelte + assignee logic in store
- KB-08 → LabelChip.svelte + label CRUD in store
- KB-09 → FilterBar.svelte + $derived filtered state
- KB-10 → persistence.ts + $effect in store
- KB-11 → Column CRUD + column Sortable instance
- KB-12 → responsive CSS + transition polish

## Commands
```bash
npm install       # install dependencies
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview production build locally
npm run typecheck # tsc --noEmit
```

## Definition of Done (per story)
- No TypeScript errors
- Works in Chrome, Firefox, Safari
- State persists across hard reload
- Keyboard accessible (Tab, Enter, Escape)
- Responsive at 375px / 768px / 1280px
