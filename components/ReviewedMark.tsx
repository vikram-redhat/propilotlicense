// "Reviewed by the Captain Panel", shown with a question's explanation on the session and
// results pages when the question has a review date (questions.last_reviewed_at, set by
// the admin review screen). The site's copy says reviewed questions are marked: this is it.
export default function ReviewedMark({ reviewedAt, style }: { reviewedAt: string | null | undefined; style?: React.CSSProperties }) {
  if (!reviewedAt) return null
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#2E7D4F', margin: 0, ...style }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5.3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3.6 6.1l1.6 1.6 3.2-3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Reviewed by the Captain Panel
    </p>
  )
}
