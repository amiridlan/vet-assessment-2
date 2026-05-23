export type Priority = 'low' | 'medium' | 'high' | 'critical'

export interface User {
  id: string
  name: string
  initials: string
  color: string
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  columnId: string
  title: string
  description: string
  priority: Priority
  dueDate: string | null
  assigneeId: string | null
  labelIds: string[]
  order: number
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  title: string
  order: number
  color: string
}

export interface FilterState {
  assigneeIds: string[]
  labelIds: string[]
  priorities: Priority[]
}

export interface BoardData {
  version: number
  columns: Column[]
  tasks: Task[]
  labels: Label[]
}
