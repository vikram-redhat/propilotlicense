import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const client = new Anthropic()

export async function POST(req: Request) {
  const { subject, bookTitle, bookAuthor, chapterName, chapterNumber, topic, difficulty, count, context } = await req.json()

  if (!subject || !difficulty || !count) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const topicLine = chapterName
    ? `Chapter: ${chapterName} (Chapter ${chapterNumber})`
    : topic
    ? `Topic: ${topic}`
    : `Topic: General — cover a range of topics within the subject`

  const prompt = `You are an expert aviation examiner creating questions for the DGCA (India) pilot licence exams.

Generate exactly ${count} multiple choice question${count > 1 ? 's' : ''}.

Subject: ${subject}
${topicLine}
Source book: "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}
Difficulty: ${difficulty}
${context ? `Additional context: ${context}` : ''}

Difficulty guide:
- easy: factual recall, definitions, simple identification
- medium: application of a concept, standard calculation, interpreting data
- hard: multi-step problems, nuanced regulatory edge cases, combined concepts

EXPLANATION: Write a full paragraph of 5–6 lines in the authoritative voice of "${bookTitle}".
It should read like a textbook excerpt — educational, covering the broader concept, not just the answer.
A student reading it should understand the topic more deeply, not just why the correct answer is right.

CITATION: Estimate the chapter and page in "${bookTitle}" where this content is covered.
Always provide a genuine estimate — never write "unknown". These will be marked as approximate.

CRITICAL: Return ONLY a valid JSON array. No markdown fences, no preamble, no trailing text.

Each element:
{
  "question_text": "Full question text here?",
  "options": { "A": "First option", "B": "Second option", "C": "Third option", "D": "Fourth option" },
  "correct_option": "B",
  "explanation": "5–6 line textbook-style paragraph...",
  "source_chapter": "Chapter 4",
  "source_page": "Page 67",
  "difficulty": "${difficulty}"
}`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const questions = JSON.parse(text.trim())
    return Response.json({ questions })
  } catch (err) {
    return Response.json(
      { error: 'Failed to parse AI response', details: String(err) },
      { status: 500 }
    )
  }
}
