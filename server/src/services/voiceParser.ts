import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn("OPENAI_API_KEY is not set. Voice order parsing will not work.");
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export interface ParsedVoiceOrder {
  customer: string | null;
  order: string | null;
  delivery: string | null;
  advance: number | null;
}

export async function parseVoiceOrder(input: string): Promise<ParsedVoiceOrder> {
  if (!openai) {
    return {
      customer: null,
      order: null,
      delivery: null,
      advance: null
    };
  }

  const prompt = [
    "You are a parser for short shop-keeper voice notes describing tailoring orders.",
    "Extract the following fields from the text:",
    "- customer: customer name (string)",
    "- order: short description of the work (string)",
    "- delivery: delivery date or day word (string, keep as spoken, e.g. 'Monday', 'tomorrow')",
    "- advance: numeric amount of advance paid (number).",
    "",
    "Return ONLY a JSON object with keys customer, order, delivery, advance.",
    "If a field is missing, use null.",
    "",
    "Example input:",
    '"Ramesh pant stitching Monday advance 500"',
    "Example output:",
    '{\"customer\":\"Ramesh\",\"order\":\"pant stitching\",\"delivery\":\"Monday\",\"advance\":500}',
    "",
    "Now parse this input:",
    input
  ].join("\n");

  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    response_format: { type: "json" }
  });

  const raw = completion.output[0]?.content[0]?.text ?? "{}";

  try {
    const data = JSON.parse(raw) as ParsedVoiceOrder;
    return {
      customer: data.customer ?? null,
      order: data.order ?? null,
      delivery: data.delivery ?? null,
      advance: typeof data.advance === "number" ? data.advance : null
    };
  } catch {
    return {
      customer: null,
      order: null,
      delivery: null,
      advance: null
    };
  }
}

