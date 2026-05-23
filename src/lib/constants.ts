import type { User, Column, Task, Label } from './types'

export const PRESET_USERS: User[] = [
  { id: 'u1', name: 'Alice Martin', initials: 'AM', color: '#6366f1' },
  { id: 'u2', name: 'Ben Carter', initials: 'BC', color: '#f59e0b' },
  { id: 'u3', name: 'Clara Diaz', initials: 'CD', color: '#10b981' },
  { id: 'u4', name: 'David Kim', initials: 'DK', color: '#ef4444' },
  { id: 'u5', name: 'Eva Stone', initials: 'ES', color: '#8b5cf6' },
  { id: 'u6', name: 'Frank Lee', initials: 'FL', color: '#ec4899' },
]

export const LABEL_COLORS: string[] = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#6366f1', '#a855f7', '#ec4899',
]

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
}

export const DEFAULT_LABELS: Label[] = [
  { id: 'l1', name: 'Bug', color: '#ef4444' },
  { id: 'l2', name: 'Feature', color: '#6366f1' },
  { id: 'l3', name: 'Docs', color: '#06b6d4' },
]

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'col1', title: 'To Do', order: 0, color: '#6366f1' },
  { id: 'col2', title: 'In Progress', order: 1, color: '#f59e0b' },
  { id: 'col3', title: 'In Review', order: 2, color: '#8b5cf6' },
  { id: 'col4', title: 'Done', order: 3, color: '#22c55e' },
]

export const DEFAULT_TASKS: Task[] = [
  {
    id: 't1', columnId: 'col1', title: 'Design system setup', description: 'Define color tokens, typography scale, and spacing system.',
    priority: 'high', dueDate: '2026-06-01', assigneeId: 'u1', labelIds: ['l2'],
    order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't2', columnId: 'col1', title: 'Write onboarding docs', description: 'Document the setup process for new team members.',
    priority: 'low', dueDate: null, assigneeId: 'u3', labelIds: ['l3'],
    order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't3', columnId: 'col2', title: 'Fix login redirect bug', description: 'After OAuth login, users are redirected to /undefined instead of /dashboard.',
    priority: 'critical', dueDate: '2026-05-28', assigneeId: 'u4', labelIds: ['l1'],
    order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't4', columnId: 'col2', title: 'Implement dark mode', description: 'Add theme toggle with system preference detection.',
    priority: 'medium', dueDate: '2026-06-10', assigneeId: 'u2', labelIds: ['l2'],
    order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't5', columnId: 'col3', title: 'API rate limiting', description: 'Add per-user rate limiting to all public endpoints.',
    priority: 'high', dueDate: '2026-05-30', assigneeId: 'u5', labelIds: ['l2'],
    order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't6', columnId: 'col4', title: 'Set up CI pipeline', description: 'Configure GitHub Actions for lint, type-check, and build.',
    priority: 'medium', dueDate: null, assigneeId: 'u6', labelIds: [],
    order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
]
