'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { SourceBook, Subject } from '@/lib/types'
import { IconPlus, IconEdit, IconTrash, IconBook2 } from '@tabler/icons-react'

type BookWithSubject = SourceBook & {
  subject: { name: string; code: string } | null
}

export default function BooksPage() {
  const [books, setBooks] = useState<BookWithSubject[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filterSubject, setFilterSubject] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    let query = supabase
      .from('source_books')
      .select('*, subject:subjects(name,code)')
      .order('sort_order')
    if (filterSubject) query = query.eq('subject_id', filterSubject)
    const { data } = await query
    setBooks((data as BookWithSubject[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
  }, [])

  useEffect(() => { load() }, [filterSubject]) // eslint-disable-line react-hooks/exhaustive-deps

  async function deleteBook(book: BookWithSubject) {
    // Count questions referencing this book
    const { count } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('source_book_id', book.id)

    const n = count ?? 0
    const msg = `Delete '${book.title}'? ${n} question${n !== 1 ? 's' : ''} will lose their book reference but will not be deleted.`
    if (!confirm(msg)) return
    await supabase.from('source_books').delete().eq('id', book.id)
    load()
  }

  const stats = {
    total: books.length,
    cpl: books.filter(b => b.licence_types?.includes('CPL')).length,
    atpl: books.filter(b => b.licence_types?.includes('ATPL')).length,
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Source Books</h1>
          <Link
            href="/admin/books/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ backgroundColor: '#185FA5' }}
          >
            <IconPlus size={15} />
            New Book
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Books', value: stats.total, color: 'text-slate-800' },
            { label: 'CPL Licence', value: stats.cpl, color: 'text-blue-600' },
            { label: 'ATPL Licence', value: stats.atpl, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Books list */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <IconBook2 size={32} className="mx-auto mb-2 opacity-40" />
              <p>No books found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                <span>Title / Author</span>
                <span>Subject</span>
                <span>Licence</span>
                <span>Order</span>
                <span></span>
              </div>
              {books.map(book => (
                <div key={book.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{book.title}</p>
                    {book.author && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{book.author}</p>
                    )}
                  </div>
                  <div className="hidden sm:block flex-shrink-0">
                    {book.subject ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                        {book.subject.code}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-shrink-0 gap-1">
                    {(book.licence_types || []).map(lt => (
                      <span key={lt} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {lt}
                      </span>
                    ))}
                    {(!book.licence_types || book.licence_types.length === 0) && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                  <div className="hidden sm:block flex-shrink-0 w-8 text-center text-xs text-slate-500">
                    {book.sort_order}
                  </div>
                  <div className="hidden sm:flex flex-shrink-0 items-center gap-1.5">
                    {book.pdf_filename ? (
                      book.pdf_processed ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                          ✓ Processed
                        </span>
                      ) : book.pdf_processing_error ? (
                        <Link href={`/admin/books/${book.id}/edit`}
                          className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">
                          Error — retry
                        </Link>
                      ) : (
                        <Link href={`/admin/books/${book.id}/edit`}
                          className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors">
                          ⚡ Process
                        </Link>
                      )
                    ) : (
                      <Link href={`/admin/books/${book.id}/edit`}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-medium hover:text-slate-600 transition-colors">
                        No PDF
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/admin/books/${book.id}/edit`}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => deleteBook(book)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
