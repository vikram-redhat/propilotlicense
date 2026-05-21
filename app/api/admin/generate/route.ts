import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { subject, topic, difficulty, count, context } = await req.json()

  if (!subject || !topic || !difficulty || !count) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const prompt = `You are an expert aviation examiner writing questions for the DGCA (India) CPL pilot theory exam.

Generate exactly ${count} multiple choice questions on the topic: "${topic}" (subject: "${subject}").
Difficulty: ${difficulty}.
${context ? `Additional context: ${context}` : ''}

Difficulty guide:
- easy: factual recall, definitions, simple identification
- medium: application of concepts, standard calculations
- hard: multi-step problems, edge cases, nuanced regulations

IMPORTANT: Return ONLY a valid JSON array. No markdown fences, no explanation, no preamble.

Each element must have exactly this shape:
{
  "question_text": "Full question text here",
  "options": {
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  },
  "correct_option": "A",
  "explanation": "Why this answer is correct, with reference to the relevant principle or regulation."
}`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    const questions = JSON.parse(text.trim())
    return Response.json({ questions })
  } catch (err) {
    return Response.json(
      { error: 'Failed to generate or parse questions', details: String(err) },
      { status: 500 }
    )
  }
}
