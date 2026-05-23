import type { BoardData } from './types'
import { DEFAULT_COLUMNS, DEFAULT_TASKS, DEFAULT_LABELS } from './constants'

const STORAGE_KEY = 'kanban-board-v1'
const SCHEMA_VERSION = 1

export function loadBoard(): BoardData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultBoard()
    const parsed = JSON.parse(raw) as BoardData
    if (parsed.version !== SCHEMA_VERSION) return defaultBoard()
    return parsed
  } catch {
    return defaultBoard()
  }
}

export function saveBoard(data: BoardData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Some changes may not be saved.')
    }
  }
}

export function clearBoard(): void {
  localStorage.removeItem(STORAGE_KEY)
}

function defaultBoard(): BoardData {
  return {
    version: SCHEMA_VERSION,
    columns: DEFAULT_COLUMNS,
    tasks: DEFAULT_TASKS,
    labels: DEFAULT_LABELS,
  }
}
