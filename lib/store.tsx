'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import {
  GROUPS,
  INITIAL_RESERVATIONS,
  INITIAL_TASKS,
  STUDENTS,
  type Group,
  type Reservation,
  type Student,
  type Task,
  type TaskState,
} from './data'

type Role = 'estudiante' | 'profesor'

type State = {
  role: Role
  currentStudentId: string
  groups: Group[]
  students: Student[]
  tasks: Task[]
  reservations: Reservation[]
}

type Action =
  | { type: 'hydrate'; groups: Group[]; students: Student[]; tasks: Task[]; reservations: Reservation[] }
  | { type: 'setRole'; role: Role }
  | { type: 'setStudent'; studentId: string }
  | { type: 'reserve'; taskId: string; reservationId?: string }
  | { type: 'cancel'; reservationId: string }
  | { type: 'toggleCheck'; reservationId: string; index: number }
  | { type: 'setNote'; reservationId: string; note: string }
  | { type: 'submit'; reservationId: string; selfAssessment: 'cumple' | 'parcial' }
  | { type: 'review'; reservationId: string; approved: boolean; feedback: string }
  | { type: 'addTask'; task: Omit<Task, 'id' | 'code'>; taskId?: string; code?: string }

function updateReservation(state: State, id: string, patch: (r: Reservation) => Partial<Reservation>): State {
  return {
    ...state,
    reservations: state.reservations.map((r) =>
      r.id === id ? { ...r, ...patch(r), updatedAt: new Date().toISOString() } : r,
    ),
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, groups: action.groups, students: action.students, tasks: action.tasks, reservations: action.reservations }
    case 'setRole':
      return { ...state, role: action.role }
    case 'setStudent':
      return { ...state, currentStudentId: action.studentId }
    case 'reserve': {
      const student = state.students.find((s) => s.id === state.currentStudentId)
      const task = state.tasks.find((t) => t.id === action.taskId)
      if (!student || !task) return state
      const taken = state.reservations.some((r) => r.taskId === task.id && r.groupId === student.groupId)
      if (taken) return state
      return {
        ...state,
        reservations: [
          ...state.reservations,
          {
            id: action.reservationId || crypto.randomUUID(),
            taskId: task.id,
            studentId: student.id,
            groupId: student.groupId,
            status: 'reservada',
            checklist: task.requirements.map(() => false),
            note: '',
            updatedAt: new Date().toISOString(),
          },
        ],
      }
    }
    case 'cancel':
      return { ...state, reservations: state.reservations.filter((r) => r.id !== action.reservationId) }
    case 'toggleCheck':
      return updateReservation(state, action.reservationId, (r) => ({
        checklist: r.checklist.map((c, i) => (i === action.index ? !c : c)),
      }))
    case 'setNote':
      return updateReservation(state, action.reservationId, () => ({ note: action.note }))
    case 'submit':
      return updateReservation(state, action.reservationId, () => ({
        status: 'entregada',
        selfAssessment: action.selfAssessment,
      }))
    case 'review':
      return updateReservation(state, action.reservationId, () => ({
        status: action.approved ? 'aprobada' : 'rechazada',
        feedback: action.feedback,
      }))
    case 'addTask': {
      const next = state.tasks.length + 1
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            ...action.task,
            id: action.taskId || crypto.randomUUID(),
            code: action.code || `M-${String(next).padStart(2, '0')}`,
          },
        ],
      }
    }
  }
}

type Ctx = State & {
  loading: boolean
  dispatch: React.Dispatch<Action>
  getTaskState: (task: Task, studentId: string) => { state: TaskState; reservation?: Reservation }
  pointsFor: (filter: (r: Reservation) => boolean) => number
}

const StoreContext = createContext<Ctx | null>(null)

const initialState: State = {
  role: 'estudiante',
  currentStudentId: 's3',
  groups: GROUPS,
  students: STUDENTS,
  tasks: INITIAL_TASKS,
  reservations: INITIAL_RESERVATIONS,
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatchReducer] = useReducer(reducer, initialState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => dispatchReducer({ type: 'hydrate', ...data }))
      .catch((error) => console.error('No se pudo cargar la base de datos:', error))
      .finally(() => setLoading(false))
  }, [])

  const dispatch = useCallback((action: Action) => {
    if (action.type === 'setRole' || action.type === 'setStudent' || action.type === 'hydrate') {
      dispatchReducer(action)
      return
    }

    if (action.type === 'reserve') {
      const student = state.students.find((s) => s.id === state.currentStudentId)
      const task = state.tasks.find((t) => t.id === action.taskId)
      if (!student || !task) return

      const reservationId = action.reservationId || crypto.randomUUID()
      const reservation: Reservation = {
        id: reservationId,
        taskId: task.id,
        studentId: student.id,
        groupId: student.groupId,
        status: 'reservada',
        checklist: task.requirements.map(() => false),
        note: '',
        updatedAt: new Date().toISOString(),
      }

      dispatchReducer({ ...action, reservationId })
      void fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation),
      })
      return
    }

    if (action.type === 'addTask') {
      const taskId = action.taskId || crypto.randomUUID()
      const next = state.tasks.length + 1
      const task = {
        ...action.task,
        id: taskId,
        code: action.code || `M-${String(next).padStart(2, '0')}`,
      }

      dispatchReducer({ ...action, taskId, code: task.code })
      void fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      return
    }

    if (action.type === 'cancel') {
      dispatchReducer(action)
      void fetch(`/api/reservations/${action.reservationId}`, { method: 'DELETE' })
      return
    }

    const current = state.reservations.find((r) => r.id === action.reservationId)
    if (!current) return

    let updated: Reservation = { ...current, updatedAt: new Date().toISOString() }

    if (action.type === 'toggleCheck') {
      updated.checklist = current.checklist.map((checked, index) =>
        index === action.index ? !checked : checked,
      )
    }

    if (action.type === 'setNote') updated.note = action.note

    if (action.type === 'submit') {
      updated.status = 'entregada'
      updated.selfAssessment = action.selfAssessment
    }

    if (action.type === 'review') {
      updated.status = action.approved ? 'aprobada' : 'rechazada'
      updated.feedback = action.feedback
    }

    dispatchReducer(action)
    void fetch(`/api/reservations/${action.reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }, [state])

  const value = useMemo<Ctx>(() => {
    const getTaskState: Ctx['getTaskState'] = (task, studentId) => {
      const student = state.students.find((s) => s.id === studentId)
      if (!student) return { state: 'bloqueada' }
      const groupRes = state.reservations.find((r) => r.taskId === task.id && r.groupId === student.groupId)
      if (groupRes) {
        return groupRes.studentId === studentId
          ? { state: groupRes.status, reservation: groupRes }
          : { state: 'tomada', reservation: groupRes }
      }
      const unlocked = task.prerequisites.every((pid) =>
        state.reservations.some((r) => r.taskId === pid && r.groupId === student.groupId && r.status === 'aprobada'),
      )
      return { state: unlocked ? 'disponible' : 'bloqueada' }
    }
    const pointsFor: Ctx['pointsFor'] = (filter) =>
      state.reservations
        .filter((r) => r.status === 'aprobada' && filter(r))
        .reduce((sum, r) => sum + (state.tasks.find((t) => t.id === r.taskId)?.points ?? 0), 0)
    return { ...state, loading, dispatch, getTaskState, pointsFor }
  }, [state, loading, dispatch])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}


export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
