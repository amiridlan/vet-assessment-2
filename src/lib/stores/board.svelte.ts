import { loadBoard, saveBoard } from '../persistence'
import { PRESET_USERS } from '../constants'
import type { Task, Column, Label, FilterState, Priority } from '../types'

const stored = loadBoard()

let columns = $state<Column[]>(stored.columns)
let tasks = $state<Task[]>(stored.tasks)
let labels = $state<Label[]>(stored.labels)

let filters = $state<FilterState>({
  assigneeIds: [],
  labelIds: [],
  priorities: [],
})

let openTaskId = $state<string | null>(null)

// Auto-save on any mutation (debounced)
let saveTimer: ReturnType<typeof setTimeout> | null = null
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveBoard({ version: 1, columns, tasks, labels })
  }, 300)
}

// ── Derived ─────────────────────────────────────────────────────────────────

const filteredTaskIds = $derived.by(() => {
  const { assigneeIds, labelIds, priorities } = filters
  const hasFilters = assigneeIds.length || labelIds.length || priorities.length
  if (!hasFilters) return null // null = show all
  return new Set(
    tasks
      .filter(t => {
        if (assigneeIds.length && !assigneeIds.includes(t.assigneeId ?? '')) return false
        if (labelIds.length && !labelIds.some(id => t.labelIds.includes(id))) return false
        if (priorities.length && !priorities.includes(t.priority)) return false
        return true
      })
      .map(t => t.id)
  )
})

// ── Column mutations ─────────────────────────────────────────────────────────

function addColumn(title: string) {
  const maxOrder = columns.reduce((m, c) => Math.max(m, c.order), -1)
  columns.push({
    id: crypto.randomUUID(),
    title,
    order: maxOrder + 1,
    color: '#6366f1',
  })
  scheduleSave()
}

function renameColumn(id: string, title: string) {
  const col = columns.find(c => c.id === id)
  if (col) { col.title = title; scheduleSave() }
}

function deleteColumn(id: string) {
  tasks = tasks.filter(t => t.columnId !== id)
  columns = columns.filter(c => c.id !== id)
  scheduleSave()
}

function reorderColumns(newOrder: string[]) {
  newOrder.forEach((id, i) => {
    const col = columns.find(c => c.id === id)
    if (col) col.order = i
  })
  columns = [...columns].sort((a, b) => a.order - b.order)
  scheduleSave()
}

// ── Task mutations ────────────────────────────────────────────────────────────

function addTask(columnId: string, title: string): Task {
  const colTasks = tasks.filter(t => t.columnId === columnId)
  const maxOrder = colTasks.reduce((m, t) => Math.max(m, t.order), -1)
  const now = new Date().toISOString()
  const task: Task = {
    id: crypto.randomUUID(),
    columnId,
    title,
    description: '',
    priority: 'medium',
    dueDate: null,
    assigneeId: null,
    labelIds: [],
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  }
  tasks.push(task)
  scheduleSave()
  return task
}

function updateTask(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) {
  const task = tasks.find(t => t.id === id)
  if (!task) return
  Object.assign(task, patch, { updatedAt: new Date().toISOString() })
  scheduleSave()
}

function deleteTask(id: string) {
  tasks = tasks.filter(t => t.id !== id)
  scheduleSave()
}

function moveTask(taskId: string, toColumnId: string, newOrder: string[]) {
  const task = tasks.find(t => t.id === taskId)
  if (task) task.columnId = toColumnId
  newOrder.forEach((id, i) => {
    const t = tasks.find(t => t.id === id)
    if (t) t.order = i
  })
  scheduleSave()
}

function reorderTasksInColumn(columnId: string, newOrder: string[]) {
  newOrder.forEach((id, i) => {
    const t = tasks.find(t => t.id === id)
    if (t) { t.columnId = columnId; t.order = i }
  })
  scheduleSave()
}

// ── Label mutations ───────────────────────────────────────────────────────────

function addLabel(name: string, color: string): Label {
  const label: Label = { id: crypto.randomUUID(), name, color }
  labels.push(label)
  scheduleSave()
  return label
}

function updateLabel(id: string, patch: Partial<Omit<Label, 'id'>>) {
  const label = labels.find(l => l.id === id)
  if (label) { Object.assign(label, patch); scheduleSave() }
}

function deleteLabel(id: string) {
  labels = labels.filter(l => l.id !== id)
  tasks.forEach(t => { t.labelIds = t.labelIds.filter(lid => lid !== id) })
  scheduleSave()
}

// ── Filter mutations ──────────────────────────────────────────────────────────

function toggleFilterAssignee(userId: string) {
  const idx = filters.assigneeIds.indexOf(userId)
  if (idx >= 0) filters.assigneeIds.splice(idx, 1)
  else filters.assigneeIds.push(userId)
}

function toggleFilterLabel(labelId: string) {
  const idx = filters.labelIds.indexOf(labelId)
  if (idx >= 0) filters.labelIds.splice(idx, 1)
  else filters.labelIds.push(labelId)
}

function toggleFilterPriority(priority: Priority) {
  const idx = filters.priorities.indexOf(priority)
  if (idx >= 0) filters.priorities.splice(idx, 1)
  else filters.priorities.push(priority)
}

function clearFilters() {
  filters.assigneeIds = []
  filters.labelIds = []
  filters.priorities = []
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function openModal(taskId: string) { openTaskId = taskId }
function closeModal() { openTaskId = null }

// ── Export / Import ───────────────────────────────────────────────────────────

function exportBoard() {
  const data = JSON.stringify({ version: 1, columns, tasks, labels }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'kanban-export.json'
  a.click()
  URL.revokeObjectURL(url)
}

function importBoard(file: File) {
  const reader = new FileReader()
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (!data.version || !data.columns || !data.tasks || !data.labels) {
        alert('Invalid board file.')
        return
      }
      if (!confirm('This will replace your entire board. Continue?')) return
      columns = data.columns
      tasks = data.tasks
      labels = data.labels
      saveBoard({ version: 1, columns, tasks, labels })
    } catch {
      alert('Failed to parse the file. Make sure it is a valid JSON export.')
    }
  }
  reader.readAsText(file)
}

// ── Public store object ───────────────────────────────────────────────────────

export const board = {
  get columns() { return [...columns].sort((a, b) => a.order - b.order) },
  get tasks() { return tasks },
  get labels() { return labels },
  get users() { return PRESET_USERS },
  get filters() { return filters },
  get filteredTaskIds() { return filteredTaskIds },
  get openTaskId() { return openTaskId },
  get openTask() { return tasks.find(t => t.id === openTaskId) ?? null },

  addColumn, renameColumn, deleteColumn, reorderColumns,
  addTask, updateTask, deleteTask, moveTask, reorderTasksInColumn,
  addLabel, updateLabel, deleteLabel,
  toggleFilterAssignee, toggleFilterLabel, toggleFilterPriority, clearFilters,
  openModal, closeModal,
  exportBoard, importBoard,
}
