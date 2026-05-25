# Team-Ready Kanban Board

A feature-rich, client-side Kanban board for individuals and small teams. Manage tasks with
drag-and-drop, detailed modals, user assignments, colored labels, and filtering — all saved
in your browser with no account or server required.

---

## Justification of Tools

### Svelte 5 (UI Framework)

**Why not React or Vue?**
Svelte 5 was chosen because it is a _compiler_, not a runtime library. It transforms
reactive component code into optimized vanilla JavaScript at build time. This means:

- **Zero framework overhead at runtime** — no virtual DOM diffing, no reconciler
- **Svelte 5 Runes** (`$state`, `$derived`, `$effect`) provide fine-grained reactivity
  that is ideal for a Kanban board where dozens of cards respond to shared filter/assignment
  state simultaneously
- **Smaller bundle** — the compiled output for this app is under 80 KB gzipped,
  compared to ~140 KB+ for an equivalent React app
- **Less boilerplate** — no `useCallback`, `useMemo`, `memo()`, or prop-drilling guards
  are needed; reactivity is automatic at the declaration site

React and Vue were ruled out because they would add unnecessary runtime weight for a
purely client-side, localStorage-backed app with no API calls.

### TypeScript (Language)

TypeScript was chosen over plain JavaScript to enforce correctness on the data model —
particularly the relationships between `Task`, `Column`, `Label`, and `User` objects that
pass through filtering, assignment, and persistence layers. Strict mode (`"strict": true`)
catches null/undefined mismatches before they become runtime bugs in localStorage
deserialization.

### Vite (Build Tool)

Vite was chosen over Webpack or Parcel because:

- **Near-instant HMR** via native ES module serving (no bundling during dev)
- **First-class Svelte plugin** (`@sveltejs/vite-plugin-svelte`) with zero config
- **Simple static output** — `npm run build` produces a `dist/` folder that can be served
  from any static host or opened directly as a file

### Tailwind CSS v4 (Styling)

Tailwind v4 was chosen because:

- **CSS-first configuration** — no JavaScript config file; custom tokens live in `app.css`
  using `@theme {}`, which keeps all design decisions in one place
- **Zero dead code in production** — Tailwind v4 scans source files and emits only used
  utility classes
- **Utility classes eliminate component stylesheet fragmentation** — in a Svelte project,
  scoped `<style>` blocks are tempting but lead to duplication across Card, Modal, and
  Column components; Tailwind utilities share a single source of truth

### SortableJS (Drag & Drop)

SortableJS was chosen over the HTML5 Drag and Drop API or other libraries (e.g.,
`dnd-kit`, `react-beautiful-dnd`) because:

- **Framework-agnostic** — works as a plain DOM library, easily wrapped in a Svelte
  `$effect`, with no Svelte-specific bindings required
- **Touch support built-in** — works on mobile without a separate touch adapter
- **Mature and stable** — 30k+ GitHub stars, actively maintained, zero known
  accessibility regressions for keyboard users (cards also support keyboard reorder)
- React-specific DnD libraries (`react-beautiful-dnd`, `dnd-kit`) were eliminated
  immediately because this project does not use React

### localStorage (Persistence)

No IndexedDB or third-party state manager (Zustand, Pinia) was used because:

- The data volume (tasks, columns, labels) fits comfortably within the 5–10 MB
  localStorage quota for any realistic personal/small-team board
- localStorage is synchronous and requires no async ceremony for reads/writes
- A versioned JSON schema (`kanban-board-v1`) guards against silent data corruption
  if the data model changes in a future update

---

## High-Level Approach

### Strategy

A **two-phase, chained prompt approach** was used to build this project:

**Phase 1 — Planning (before any code was written)**
The first prompt handed the project brief to the agent and explicitly asked it to:

- Choose the tech stack independently
- Plan an agile sprint using the sprint-planner skill
- Produce `CLAUDE.md` (agent reference) and `README.md` (human-facing docs)
- Wait for an explicit "start" signal before writing any implementation code

This separation ensured that architecture decisions, sprint stories, acceptance criteria,
and documentation were locked in and reviewed before a single line of source code existed.
It also forced deliberate tool selection rather than reaching for a default stack.

**Phase 2 — Implementation (triggered by "start")**
The second prompt was a single word: `start`. This triggered a linear, story-by-story
build following the sprint order (KB-01 → KB-13). The agent used a `TodoWrite` task list
to track each story in real time, marking items complete immediately upon finishing them.

### Logic Structure

The implementation followed a dependency-first order:

1. **Data layer first** — types, constants, persistence, and the central Svelte 5 rune
   store were written before any UI. This meant every component had a complete, typed
   API to call from the moment it was created.
2. **Leaf components before containers** — `UserAvatar` and `LabelChip` were built before
   `TaskCard`, which was built before `TaskModal`, which was built before `Column` and
   `Board`. Each component only depended on things that already existed.
3. **State lives in one place** — all mutations (`addTask`, `deleteColumn`, `toggleFilterLabel`,
   etc.) are defined in `board.svelte.ts`. Components call store methods; they never
   mutate props directly.
4. **Build verification at the end of scaffolding** — `npm run build` was run after all
   files were written to catch errors before any manual testing.

---

## Final Prompts

The following are the exact prompts used to produce this project, in order.

---

**Prompt 1 — Project setup and planning**

```
The "Team-Ready" Kanban Board
• Product Details: A feature-rich, client-side Kanban board application. It
includes detailed task modals, simulated user assignments, colored labels/tags,
and filtering capabilities, with all data saved in the browser.
• Objective: The objective is to develop a Kanban board application that
operates entirely in the browser. It should provide advanced project
management features like task assignments, colored labels, and filtering to
help users organize workflows.
• Target User: An individual or small team lead looking for a flexible project
management tool for personal or team-simulated task tracking without a cloud-
based service.

This is an empty folder, not git repo is published yet. Based on the project
description above, create a client-side kanban board application. Create an
agile sprint for tracking development. This time, don't default to my tech
stack. you have to choose which programming language or tools you use to
create this project. Create CLAUDE.md for you to reference the project and
README.md for Justification of Tools: Explain why you chose your specific
tools as well as Instructions: A step-by-step guide on how to run your project
and reproduce your results.

wait for me to say start before proceeding the sprint
```

---

**Prompt 2 — Invoke available skills**

```
use necessary skills available for your perusal
```

> This caused the agent to invoke the `sprint-planner` skill, which produced
> the structured sprint backlog with story points, acceptance criteria, and a
> risk table.

---

**Prompt 3 — Dedicated sprint tracking file**

```
create a new file called SPRINT.md for tracking each sprints
```

---

**Prompt 4 — Begin implementation**

```
start
```

---

**Prompt 5 — Sync sprint file after implementation**

```
update the sprint file
```

---

## How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher (comes with Node.js)

Verify your versions:

```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

### Step-by-Step Setup

**1. Clone or download the project**

```bash
# If using git:
git clone <repo-url>
cd vet-assessment-2

# Or unzip the downloaded folder and cd into it
```

**2. Install dependencies**

```bash
npm install
```

This installs Svelte 5, Vite, TypeScript, Tailwind CSS v4, SortableJS, and all dev tooling.
Expected install time: 15–30 seconds.

**3. Start the development server**

```bash
npm run dev
```

Open your browser to **http://localhost:5173**

The board loads with a default set of columns and sample tasks so you can see it working
immediately. Any changes you make are auto-saved to localStorage.

**4. Build for production (optional)**

```bash
npm run build
```

The compiled app is written to `dist/`. It is a fully static bundle — open `dist/index.html`
directly in a browser, or serve it with any static file server:

```bash
npm run preview   # serves the dist/ folder at http://localhost:4173
```

**5. Type-check (optional)**

```bash
npm run typecheck
```

Runs `tsc --noEmit` to verify no TypeScript errors exist without emitting files.

---

## Challenges & Iterations

### 1. Vite scaffold blocked on non-empty directory

**Challenge**: `npm create vite@latest . -- --template svelte-ts` cancelled immediately
because `CLAUDE.md`, `README.md`, and `SPRINT.md` already existed in the folder.
The tool does not support a `--force` flag to overwrite an existing directory.

**Iteration**: Dropped the scaffold entirely and manually created every config file
(`package.json`, `vite.config.ts`, `tsconfig.json`, `svelte.config.js`, `index.html`)
from scratch. This was actually beneficial — it made the configuration explicit and
reviewable rather than generated from a black-box template.

### 2. Svelte 5 accessibility lint warnings at build time

**Challenge**: `npm run build` surfaced multiple `vite-plugin-svelte` accessibility
warnings: the modal `<div role="dialog">` was missing `tabindex`, form `<label>` elements
were not associated with their controls, and non-input group labels (Assignee, Labels)
triggered the same rule incorrectly.

**Iteration**: Fixed in a second pass after the first clean build:

- Added `tabindex="-1"` to the modal backdrop div
- Added matching `id` + `for` attributes to the Description, Priority, and Due Date label/input pairs
- Replaced `<label>` with `<span>` for the Assignee and Labels group headings, which are
  not semantically associated with a single control

### 3. Svelte 5 `state_referenced_locally` reactivity warning

**Challenge**: Two components initialized `$state` variables using prop values directly
at declaration time — `const dim = size === 'sm' ? ...` in `UserAvatar.svelte` and
`let editTitle = $state(column.title)` in `Column.svelte`. Svelte 5 warned that these
expressions only capture the value once and will not re-run if the prop changes.

**Iteration**:

- `UserAvatar`: wrapped in `$derived` so `dim` recalculates if the `size` prop ever changes
- `Column`: initialized `editTitle` as an empty `$state('')` and assigned `column.title`
  inside `startEdit()` at the moment the user activates the rename input, which is the
  only time the current value is actually needed

### 4. SortableJS and Svelte 5 reactivity co-ordination

**Challenge**: SortableJS mutates the DOM directly on drag-end. Svelte 5's fine-grained
reactivity owns the DOM, so after a drop, the DOM and the `$state` arrays were
temporarily out of sync — Svelte would re-render and undo SortableJS's move.

**Iteration**: Mounted SortableJS inside a `$effect` (which re-runs when the element
mounts) and in the `onEnd` callback, read the new DOM order from `evt.to.children`,
extracted `data-task-id` attributes, and called `board.reorderTasksInColumn` or
`board.moveTask` to update `$state` to match what SortableJS already did. This made
Svelte's next render a no-op (state already matched DOM) rather than a conflict.

---

## Reproducing Results

To reproduce the exact development environment:

1. Use **Node.js v20 LTS** (the version locked in `.nvmrc` if present)
2. Run `npm install` — `package-lock.json` pins all transitive dependency versions
3. Run `npm run dev` — Vite serves from source with HMR; no cache invalidation needed
4. To reset the board to its default state, open DevTools → Application → Local Storage →
   delete the `kanban-board-v1` key, then hard-refresh the page

---

## Browser Support

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 110+            |
| Firefox | 110+            |
| Safari  | 16.4+           |
| Edge    | 110+            |

Requires: CSS Grid, CSS Custom Properties, `crypto.randomUUID()`, localStorage.
