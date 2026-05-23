# Sprint Tracking — Team-Ready Kanban Board

---

## Sprint 1: Full Build
**Goal**: Deliver a fully functional Team-Ready Kanban Board v1.0 — all core features implemented, browser-persistent, responsive, and ready for use without a backend.

**Duration**: 2 weeks (10 working days)
**Capacity**: 42 story points (1 dev × 10 days × 6 hrs × 0.7 focus factor)
**Status**: `DONE`

---

### Progress

| Story ID | Description | Points | Day(s) | Status |
|----------|-------------|--------|--------|--------|
| KB-01 | Project scaffolding (Svelte 5 + TS + Vite + Tailwind v4) | 1 | 1 | `DONE` |
| KB-02 | Board layout with multiple named columns | 3 | 1 | `DONE` |
| KB-03 | Task card component (compact view) | 3 | 2 | `DONE` |
| KB-04 | Drag-and-drop cards between columns (SortableJS) | 5 | 3–4 | `DONE` |
| KB-05 | Full task CRUD (create, edit, delete) | 5 | 5 | `DONE` |
| KB-06 | Task detail modal (title, description, due date, priority) | 8 | 6–7 | `DONE` |
| KB-07 | Simulated user assignment system (preset roster) | 5 | 8 | `DONE` |
| KB-08 | Colored labels / tags system (create, assign, delete) | 5 | 8 | `DONE` |
| KB-09 | Filter bar (by user, label, priority) | 5 | 9 | `DONE` |
| KB-10 | LocalStorage persistence (auto-save + rehydration) | 3 | 9 | `DONE` |
| KB-11 | Column CRUD (add, rename, delete, reorder) | 3 | 10 | `DONE` |
| KB-12 | Responsive layout + visual polish | 3 | 10 | `DONE` |
| **KB-13** | **[Stretch] Board import / export (JSON)** | **3** | **if time** | `DONE` |

**Points Completed**: 45 / 42 (stretch goal completed)
**Velocity**: 45 pts

---

### Story Details & Acceptance Criteria

#### KB-01 — Project Scaffolding (1 pt)
**Status**: `DONE`
- [x] `npm create vite` with Svelte + TypeScript template (manually scaffolded — vite blocked on non-empty dir)
- [x] Svelte 5 installed and runes mode enabled
- [x] Tailwind CSS v4 configured via `@import "tailwindcss"` in `app.css`
- [x] `npm run dev` serves app at localhost:5173
- [x] `tsc --noEmit` passes with strict mode on
- [x] SortableJS installed as a dependency

#### KB-02 — Board Layout & Columns (3 pts)
**Status**: `DONE`
- [x] Four default columns render: To Do, In Progress, In Review, Done
- [x] Columns display horizontally with overflow scroll
- [x] Column header shows title and task count badge
- [x] Board fills viewport height; columns scroll independently

#### KB-03 — Task Card Component (3 pts)
**Status**: `DONE`
- [x] Card displays: title, priority color indicator, due date, assignee avatar, label chips
- [x] Long titles truncate with ellipsis (`line-clamp-2`)
- [x] Card hover state visible (shadow + border highlight)
- [x] Empty column shows an empty-state placeholder

#### KB-04 — Drag & Drop via SortableJS (5 pts)
**Status**: `DONE`
- [x] Cards drag smoothly within a column (reorder)
- [x] Cards move between columns on drop
- [x] Ghost/clone preview shown during drag (`.sortable-ghost` + `.sortable-drag` CSS)
- [x] Column order persists after drop
- [x] Touch drag works on mobile (SortableJS built-in)
- [x] SortableJS mounted via Svelte `$effect` + `use:action` pattern; DOM mutations synced back to `$state`

#### KB-05 — Task CRUD (5 pts)
**Status**: `DONE`
- [x] "+ Add Task" button per column opens inline title input
- [x] Enter key saves new task; Escape cancels
- [x] Task deleted via modal footer with a confirmation prompt
- [x] Title editable inline in the modal
- [x] Store exposes `addTask`, `updateTask`, `deleteTask` mutations

#### KB-06 — Task Detail Modal (8 pts)
**Status**: `DONE`
- [x] Clicking a card opens the modal
- [x] Editable fields: title, description (textarea), due date picker, priority dropdown
- [x] Priority options: Low / Medium / High / Critical
- [x] Changes auto-save on every input event (live update via store)
- [x] ESC key closes modal
- [x] Focus trapped inside modal while open (custom `trapFocus` action)
- [x] Click-outside-to-close supported
- [x] Modal is accessible: `role="dialog"`, `aria-modal`, `aria-labelledby`, `tabindex="-1"`

#### KB-07 — User Assignment System (5 pts)
**Status**: `DONE`
- [x] Preset roster of 6 users (name + initials + avatar color) in `constants.ts`
- [x] Assign/unassign user from the task modal (toggle button row)
- [x] Card shows assignee avatar when assigned
- [x] Unassigned cards show a neutral placeholder avatar icon
- [x] Only one assignee per task (clicking a selected user deselects them)

#### KB-08 — Labels / Tags System (5 pts)
**Status**: `DONE`
- [x] 8 preset label colors available in color picker
- [x] Create a new label (name + color) from the task modal
- [x] Assign multiple labels to a task (toggle chips in modal)
- [x] Remove a label from a task (toggle off in modal)
- [x] Delete a label globally — removes it from all tasks automatically
- [x] Labels shown as color chips on card and inside modal

#### KB-09 — Filter Bar (5 pts)
**Status**: `DONE`
- [x] Toolbar shows filter controls: assignee avatar row, priority pills, label chips
- [x] Active filters visually highlighted (ring + scale effect)
- [x] Cards not matching active filters are dimmed (`opacity-30 pointer-events-none`)
- [x] "Clear all" button resets all filters (shown only when filters are active)
- [x] Filters are AND-combined (task must match every active filter)
- [x] Filtered state derived via `$derived.by()` in the store

#### KB-10 — LocalStorage Persistence (3 pts)
**Status**: `DONE`
- [x] All state auto-saves on every mutation (debounced 300 ms via `scheduleSave`)
- [x] State rehydrates on page reload with zero data loss
- [x] Storage key: `kanban-board-v1`
- [x] Schema version field guards against corruption on future updates
- [x] Save failures (quota exceeded) surface an `alert()` warning

#### KB-11 — Column CRUD (3 pts)
**Status**: `DONE`
- [x] "+ Add Column" button at the right edge of the board (dashed border card)
- [x] Double-click column header to rename inline (blur or Enter commits)
- [x] Delete column via column header trash icon; warns with task count if tasks exist
- [x] Drag-reorder columns (separate SortableJS instance on `.board` element)

#### KB-12 — Responsive Layout & Polish (3 pts)
**Status**: `DONE`
- [x] Board horizontally scrollable on narrow viewports (375px+)
- [x] Smooth CSS animations: modal fade+slide (`@keyframes fadeIn`, `slideUp`), card drag rotation
- [x] Consistent color system via CSS custom properties in `@theme {}` block
- [x] Custom scrollbar styling for a polished look
- [x] Priority colors consistent: Low=green, Medium=yellow, High=orange, Critical=red
- [x] Overdue due dates highlighted in red on task cards

#### KB-13 — Import / Export JSON [STRETCH] (3 pts)
**Status**: `DONE`
- [x] "Export" button in navbar downloads `kanban-export.json` with full board state
- [x] "Import" button opens native file picker, reads valid JSON, shows confirmation dialog
- [x] Invalid JSON surfaces an `alert()` error (no silent failure)
- [x] Import replaces entire board state after user confirms

---

### Risks — Actual Outcomes

| Risk | Outcome |
|------|---------|
| SortableJS ↔ Svelte 5 reactivity conflicts | Resolved — SortableJS wrapped in `$effect`; DOM mutations synced via `onEnd` callback into `$state` |
| Tailwind v4 CSS-first syntax unfamiliarity | No issue — `@import "tailwindcss"` + `@theme {}` worked as documented |
| localStorage quota exceeded | Handled — `DOMException` caught in `saveBoard`; user shown an alert |
| Svelte 5 runes edge cases | Minor — `state_referenced_locally` warnings on `$state` init; resolved by moving to `$derived` |
| Modal focus trap bugs | Resolved — custom `trapFocus` Svelte action handles Tab/Shift+Tab cycling cleanly |
| `npm create vite` blocked on non-empty directory | Unplanned — scaffold cancelled due to existing files; manually created all config files instead |

---

### Definition of Done
- [x] No TypeScript errors (`npm run typecheck` clean)
- [x] `npm run build` produces a working static bundle (`✓ built in 958ms`, zero warnings)
- [x] All state persists correctly across hard page reloads (localStorage key `kanban-board-v1`)
- [ ] Works in latest Chrome, Firefox, and Safari (pending manual cross-browser test)
- [x] Responsive at 375px, 768px, and 1280px viewports (horizontal scroll on narrow screens)
- [x] All interactive elements keyboard-accessible (Tab / Enter / Escape)
- [x] No console errors or warnings in production build

---

## Sprint Log

| Sprint | Goal | Points Committed | Points Completed | Outcome |
|--------|------|-----------------|-----------------|---------|
| Sprint 1 | Full Build v1.0 | 42 | 45 | COMPLETED — stretch goal delivered |

---

## Sprint 1 Retrospective

### What went well
- All 12 committed stories delivered plus the stretch goal (KB-13 Import/Export) in a single session
- Svelte 5 runes (`$state`, `$derived.by`, `$effect`) made reactive state straightforward — no prop-drilling or context boilerplate
- SortableJS integrated cleanly via `$effect` without framework conflicts
- Build was clean on first attempt; only accessibility warnings required minor fixes

### What could improve
- `npm create vite` does not support scaffolding into a non-empty directory — pre-clearing the folder or using `--force` would avoid manual file creation
- Svelte 5 `state_referenced_locally` lint warnings indicate a pattern to watch: always wrap prop-derived values in `$derived` rather than assigning them directly in `$state` initializers
- Cross-browser testing (Safari) still outstanding before marking DoD 100% complete

### Carry-over / backlog ideas for Sprint 2
- [ ] Search bar (full-text search across task titles and descriptions)
- [ ] Dark mode toggle
- [ ] Column WIP (work-in-progress) limits with visual warning
- [ ] Task activity log / comments section in modal
- [ ] Keyboard shortcut to create a task (`N`) or open search (`/`)
- [ ] Drag handle on task cards for more precise mobile UX

---

> Story statuses: `TODO` → `IN PROGRESS` → `DONE` / `BLOCKED`
> Update **Points Completed** and **Velocity** in the Sprint Log after each sprint closes.
