// ponytail: Vercel provides country from IP for free via header
export async function GET(req: Request) {
  const country = req.headers.get('x-vercel-ip-country') ?? 'IN'
  const region = country === 'IN' ? 'IN' : 'INTL'
  return Response.json({ region })
}
