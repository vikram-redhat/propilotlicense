// Landing hub for a user's exam type. ATPL candidates use /atpl; CPL and
// Composite (foreign-licence conversion, which sits on the CPL papers) use /cpl.
// Use this everywhere a signed-in user is routed "into" the app so ATPL users
// are never sent to the CPL hub.
export function hubForExamType(examType: string | null | undefined): string {
  return examType === 'ATPL' ? '/atpl' : '/cpl'
}
