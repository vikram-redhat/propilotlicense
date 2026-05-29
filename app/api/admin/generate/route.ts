import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { subject, bookTitle, bookAuthor, topic, difficulty, count, context } = await req.json()

  if (!subject || !topic || !difficulty || !count) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const prompt = `You are an expert aviation examiner creating questions for the DGCA (India) pilot licence exams.

Generate exactly ${count} multiple choice questions.

Subject: ${subject}
Topic: ${topic}
Source book: "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}
Difficulty: ${difficulty}
${context ? `Additional context: ${context}` : ''}

Difficulty guide:
- easy: factual recall, definitions, simple identification
- medium: application of a concept, a standard calculation, interpreting data
- hard: multi-step problems, nuanced regulatory edge cases, combined concepts

EXPLANATION REQUIREMENT — this is critical:
Write the explanation as a full paragraph of 5–6 lines, in the style and voice of "${bookTitle}".
It should read like an excerpt from the textbook itself — authoritative, educational, and covering
the surrounding concept, not just the answer. A student reading it should feel they understand
the topic more deeply, not just why option B was correct.

Also estimate the chapter and page in "${bookTitle}" where this topic is covered.
Your estimates will be marked as approximate and verified by a human editor.
Format: "Chapter N" and "Page N". Make a genuine best estimate — do not write "unknown".

IMPORTANT: Return ONLY a valid JSON array. No markdown fences, no preamble.

Each element must follow this exact shape:
{
  "question_text": "Full question text here",
  "options": {
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  },
  "correct_option": "B",
  "explanation": "Full 5-6 line paragraph explanation in the style of the textbook...",
  "source_chapter": "Chapter 4",
  "source_page": "Page 67",
  "difficulty": "${difficulty}"
}`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
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
