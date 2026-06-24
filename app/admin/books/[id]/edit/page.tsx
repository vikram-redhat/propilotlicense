'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject } from '@/lib/types'

const LICENCE_OPTIONS = ['CPL', 'ATPL']

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [edition, setEdition] = useState('')
  const [licenceTypes, setLicenceTypes] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState(0)

  const [pdfStoragePath, setPdfStoragePath] = useState<string | null>(null)
  const [pdfFilename, setPdfFilename] = useState<string | null>(null)
  const [pdfUploadedAt, setPdfUploadedAt] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [pdfError, setPdfError] = useState('')

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
  }, [])

  useEffect(() => {
    async function loadBook() {
      const { data } = await supabase.from('source_books').select('*').eq('id', id).single()
      if (data) {
        setSubjectId(data.subject_id || '')
        setTitle(data.title || '')
        setAuthor(data.author || '')
        setEdition(data.edition || '')
        setLicenceTypes(data.licence_types || [])
        setSortOrder(data.sort_order ?? 0)
        setPdfStoragePath(data.pdf_storage_path || null)
        setPdfFilename(data.pdf_filename || null)
        setPdfUploadedAt(data.pdf_uploaded_at || null)
      }
      setLoading(false)
    }
    loadBook()
  }, [id])

  function toggleLicence(lt: string) {
    setLicenceTypes(prev =>
      prev.includes(lt) ? prev.filter(x => x !== lt) : [...prev, lt]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('source_books').upsert({
      id,
      subject_id: subjectId || null,
      title: title.trim(),
      author: author.trim() || null,
      edition: edition.trim() || null,
      licence_types: licenceTypes,
      sort_order: sortOrder,
    })
    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }
    router.push('/admin/books')
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (file.type !== 'application/pdf') { setPdfError('PDF files only'); return }
    if (file.size > 20 * 1024 * 1024) { setPdfError('File must be under 20MB'); return }

    setPdfError('')
    setUploading(true)

    if (pdfStoragePath) {
      await supabase.storage.from('reference-documents').remove([pdfStoragePath])
    }

    const path = `books/${id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('reference-documents')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setPdfError(uploadError.message)
      setUploading(false)
      return
    }

    await supabase.from('source_books').update({
      pdf_storage_path: path,
      pdf_filename: file.name,
      pdf_uploaded_at: new Date().toISOString(),
    }).eq('id', id)

    setPdfStoragePath(path)
    setPdfFilename(file.name)
    setPdfUploadedAt(new Date().toISOString())
    setUploading(false)
  }

  async function removePdf() {
    if (!pdfStoragePath) return
    if (!confirm('Remove the PDF from this book?')) return
    await supabase.storage.from('reference-documents').remove([pdfStoragePath])
    await supabase.from('source_books').update({
      pdf_storage_path: null,
      pdf_filename: null,
      pdf_uploaded_at: null,
      pdf_page_count: null,
    }).eq('id', id)
    setPdfStoragePath(null)
    setPdfFilename(null)
    setPdfUploadedAt(null)
  }

  async function downloadPdf() {
    if (!pdfStoragePath) return
    const { data } = await supabase.storage
      .from('reference-documents')
      .createSignedUrl(pdfStoragePath, 300)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Edit Book</h1>
          <Link href="/admin/books" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            ← Back to Books
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
            <select value={subjectId} onChange={e => setSubjectId(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">— None —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Air Navigation" required
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Author</label>
            <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="e.g. IC Joshi"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Edition</label>
            <input type="text" value={edition} onChange={e => setEdition(e.target.value)}
              placeholder="e.g. 3rd Edition or 2006"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Licence Types</label>
            <div className="flex gap-4">
              {LICENCE_OPTIONS.map(lt => (
                <label key={lt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={licenceTypes.includes(lt)} onChange={() => toggleLicence(lt)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">{lt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sort Order</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))}
              className="w-32 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* PDF */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Reference PDF</label>
            {pdfFilename ? (
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M9 15l2 2 4-4" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{pdfFilename}</p>
                    {pdfUploadedAt && (
                      <p className="text-xs text-slate-500">
                        Uploaded {new Date(pdfUploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={downloadPdf}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors">
                    ↓ Download
                  </button>
                  <button type="button" onClick={removePdf}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:border-red-300 transition-colors">
                    Remove
                  </button>
                  <label className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
                    ↑ Replace
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                {uploading ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    Uploading…
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-500 mb-3">No PDF uploaded</p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      Upload PDF
                      <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" disabled={uploading} />
                    </label>
                    <p className="text-xs text-slate-400 mt-2">PDF only · Max 20MB</p>
                  </>
                )}
              </div>
            )}
            {pdfError && <p className="text-xs text-red-600 mt-1.5">{pdfError}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
              style={{ backgroundColor: '#185FA5' }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link href="/admin/books"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:border-slate-300 transition-all">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
