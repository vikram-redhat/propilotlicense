export interface Subject {
  id: string
  name: string
  code: string
  description: string | null
  icon_name: string | null
  sort_order: number
  active: boolean
  created_at: string
  question_count?: number
}

export interface Topic {
  id: string
  subject_id: string
  name: string
  sort_order: number
}

export interface SourceBook {
  id: string
  subject_id: string
  title: string
  author: string | null
}

export interface Question {
  id: string
  subject_id: string
  topic_id: string | null
  question_text: string
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string | null
  source_type: 'manual' | 'ai'
  active: boolean
  flagged: boolean
  created_at: string
  options?: QuestionOption[]
  subject?: Subject
  topic?: Topic
}

export interface QuestionOption {
  id: string
  question_id: string
  option_letter: 'A' | 'B' | 'C' | 'D'
  option_text: string
  is_correct: boolean
}

export interface Session {
  id: string
  subject_id: string
  mode: 'practice' | 'mock'
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
  question_ids: string[]
  created_at: string
}

export interface SessionState {
  sessionId: string
  currentIndex: number
  answers: Record<string, { selected: string; isCorrect: boolean }>
  startedAt: string
  submittedAt?: string
}

export interface GeneratedQuestion {
  question_text: string
  options: { A: string; B: string; C: string; D: string }
  correct_option: 'A' | 'B' | 'C' | 'D'
  explanation: string
}
