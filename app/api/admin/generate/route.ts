import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { subject, bookTitle, bookAuthor, topic, difficulty, count, context } = await req.json()

  if (!subject || !topic || !difficulty || !count) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const bookSection = bookTitle
    ? `Source book: "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}`
    : 'Source book: general DGCA study material'

  const citationInstruction = bookTitle
    ? `For each question, also estimate the chapter and page number in "${bookTitle}" where the relevant content is covered. Make your best estimate — these will be marked as approximate and verified by a human editor. Format chapter as "Chapter N" and page as "Page N".`
    : 'Set source_chapter and source_page to empty strings.'

  const prompt = `You are an expert aviation examiner writing questions for the DGCA (India) pilot licence exams.

Generate exactly ${count} multiple choice questions on the topic: "${topic}"
Subject: ${subject}
${bookSection}
Difficulty: ${difficulty}
${context ? `Additional context: ${context}` : ''}

Difficulty guide:
- easy: factual recall, definitions, simple identification
- medium: application of concepts, standard calculations
- hard: multi-step problems, edge cases, nuanced regulations

${citationInstruction}

IMPORTANT: Return ONLY a valid JSON array. No markdown fences, no preamble, no explanation.

Each element must have exactly this shape:
{
  "question_text": "Full question text",
  "options": {
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  },
  "correct_option": "B",
  "explanation": "Clear explanation of why this answer is correct.",
  "source_chapter": "Chapter 4",
  "source_page": "Page 67",
  "difficulty": "${difficulty}"
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
