// Claude-powered doubt resolution. Active when ANTHROPIC_API_KEY is set;
// callers fall back to the retrieval matcher otherwise, so the pilot works
// with or without an API budget.
import Anthropic from '@anthropic-ai/sdk';

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

export const aiEnabled = () => client !== null;

const SYSTEM = `You are Scolrly's NEET doubt-resolution tutor, built by Bright Mind Institute (BMI), Imphal. You answer doubts from Class 11/12 students preparing for NEET (Physics, Chemistry, Biology).

Rules:
- Answer in 3-6 short sentences a Class 12 student can follow. Explain the concept, then the reasoning, then the takeaway.
- Anchor every answer in NCERT: name the relevant NCERT chapter in the ncertRef field (e.g. "Biology Ch 16 — Digestion and Absorption").
- If a formula is central, state it in plain text (e.g. F = kq1q2/r^2).
- Stay strictly on NEET syllabus topics. If the question is off-topic, say so briefly and steer the student back to their syllabus.
- Never invent NCERT page numbers; chapter-level references only.`;

// Returns { answer, ncertRef } or null (caller falls back).
export async function askClaude(question, subject) {
  if (!client) return null;
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              answer: { type: 'string', description: 'The tutoring answer, 3-6 sentences.' },
              ncertRef: { type: 'string', description: 'NCERT anchor, e.g. "Physics Ch 1 — Electric Charges and Fields"' },
            },
            required: ['answer', 'ncertRef'],
            additionalProperties: false,
          },
        },
      },
      messages: [{
        role: 'user',
        content: `Subject filter: ${subject || 'all'}\nStudent's doubt: ${question}`,
      }],
    });
    if (response.stop_reason === 'refusal') return null;
    const text = response.content.find((b) => b.type === 'text')?.text;
    if (!text) return null;
    const parsed = JSON.parse(text);
    if (!parsed.answer) return null;
    return { answer: parsed.answer, ncertRef: parsed.ncertRef || 'NCERT — general reference' };
  } catch (err) {
    console.error('askClaude failed:', err.message);
    return null;
  }
}
