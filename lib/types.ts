export interface Subject {
  id: string
  name: string
  code: string
  description: string | null
  icon_name: string | null
  licence_types: string[]
  sort_order: number
  active: boolean
  created_at: string
  question_count?: number
  book_count?: number
}

export interface Topic {
  id: string
  subject_id: string
  name: string
  sort_order: number
}

export interface Chapter {
  id: string
  book_id: string
  chapter_number: number
  chapter_name: string
  sort_order: number
}

export interface SourceBook {
  id: string
  subject_id: string
  title: string
  author: string | null
  edition: string | null
  licence_types: string[]
  sort_order: number
  pdf_storage_path: string | null
  pdf_filename: string | null
  pdf_uploaded_at: string | null
  pdf_page_count: number | null
  pdf_processed: boolean
  pdf_processed_at: string | null
  pdf_processing_error: string | null
}

export interface PdfChunk {
  id: string
  book_id: string
  chapter_id: string | null
  chunk_index: number
  heading: string | null
  page_start: number | null
  page_end: number | null
  content: string
  token_estimate: number | null
  created_at: string
}

export interface Question {
  id: string
  subject_id: string
  topic_id: string | null
  source_book_id: string | null
  chapter_id: string | null
  question_text: string
  difficulty: 'basic' | 'advanced'
  explanation: string | null
  source_chapter: string | null
  source_page: string | null
  citation_verified: boolean
  source_type: 'manual' | 'ai'
  active: boolean
  flagged: boolean
  created_at: string
  options?: QuestionOption[]
  subject?: Subject
  topic?: Topic
  source_book?: SourceBook
  chapter?: Chapter
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
  licence_type: string
  scope: 'topic' | 'book' | 'book_chapter' | 'combined'
  topic_id: string | null
  source_book_id: string | null
  chapter_id: string | null
  mode: 'practice' | 'mock'
  difficulty: 'all' | 'basic' | 'advanced'
  question_count: number
  time_limit_secs: number
  question_ids: string[]
  created_at: string
}

export interface SessionState {
  sessionId: string
  currentIndex: number
  answers: Record<string, { selected: string; isCorrect: boolean; timeTaken?: number }>
  startedAt: string
  submittedAt?: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  subscription_tier: 'free' | 'pro'
  subscription_expires_at: string | null
  exam_preference: 'CPL' | 'ATPL'
  created_at: string
  updated_at: string
}

export interface SessionAnswer {
  id: string
  session_id: string
  question_id: string
  selected_option_id: string | null
  is_correct: boolean
  answered_at: string
}

export interface QuestionFlag {
  id: string
  question_id: string
  user_id: string
  reason: string | null
  resolved: boolean
  created_at: string
}

export interface GeneratedQuestion {
  question_text: string
  options: { A: string; B: string; C: string; D: string }
  correct_option: 'A' | 'B' | 'C' | 'D'
  explanation: string
  source_chapter: string
  source_page: string
  difficulty: string
  citation_verified?: boolean
}
