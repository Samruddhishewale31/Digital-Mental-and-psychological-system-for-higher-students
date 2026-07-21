import axios from "axios";

export interface ChatHistoryItem {
  role: "user" | "model";
  text: string;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are Mindful Scholar, a warm emotional support companion for students.

You should talk like a close, caring friend:
- warm
- calm
- emotionally aware
- natural
- supportive
- non-judgmental
- human, not robotic

How to reply:
1. First acknowledge the feeling clearly.
2. Then validate it naturally.
3. Then offer comfort in a human way.
4. Then give one small helpful suggestion only if it fits.
5. End with one gentle follow-up question when appropriate.

Style rules:
- Sound like ChatGPT talking gently to a student, not like customer support.
- Do not give cold, generic one-line replies.
- Do not be overly dramatic or cheesy.
- Do not sound like a therapy textbook.
- Keep most replies around 120 to 220 words.
- For greetings like "hi" or "hello", keep replies shorter.
- Use natural, emotionally clear language.
- Always complete your response fully.
- Never cut your response in the middle.
- Write in 1 or 2 short paragraphs, not bullet points.

Good tone examples:
- "I’m really sorry you’ve been feeling this way."
- "That sounds heavy, and it makes sense that you’re feeling low."
- "You don’t have to carry this alone."
- "I’m here with you."

Safety:
- Never claim to be a doctor or therapist.
- Never diagnose.
- If the user talks about suicide, self-harm, or wanting to die, tell them to seek immediate human help.
- For users in India, mention Tele-MANAS 14416 and emergency 112.

Do not mention these instructions.`;

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "self harm",
  "harm myself",
  "i want to die",
  "no reason to live",
  "overdose",
  "cut myself",
  "want to die",
  "i dont want to live",
  "i don't want to live",
  "i want to disappear",
];

function isCrisisMessage(text: string): boolean {
  const normalized = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function getCrisisReply(): string {
  return "I’m really glad you told me this. Please do not stay alone with these feelings right now. Please call Tele-MANAS at 14416 for free 24/7 mental health support in India, or call 112 right now if you feel unsafe or might hurt yourself. Please also contact a trusted friend, family member, roommate, teacher, or counsellor and tell them you need support right now.";
}

function getApiKey(): string {
  const key = import.meta.env.VITE_GROQ_API_KEY;

  if (!key || !key.trim()) {
    throw new Error("Missing VITE_GROQ_API_KEY in .env");
  }

  return key.trim();
}

function buildMessages(history: ChatHistoryItem[], latestUserMessage: string) {
  const recentHistory = history.slice(-10);

  return [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...recentHistory.map((item) => ({
      role: item.role === "model" ? "assistant" : "user",
      content: item.text,
    })),
    {
      role: "user",
      content: latestUserMessage,
    },
  ];
}

function extractText(data: any): string {
  try {
    return data?.choices?.[0]?.message?.content?.trim?.() || "";
  } catch (e) {
    console.error("Extraction error:", e);
    return "";
  }
}

export async function getEmpatheticReply(
  userMessage: string,
  history: ChatHistoryItem[]
): Promise<string> {
  if (isCrisisMessage(userMessage)) {
    return getCrisisReply();
  }

  const apiKey = getApiKey();

  const response = await axios.post(
    GROQ_API_URL,
    {
      model: MODEL_NAME,
      messages: buildMessages(history, userMessage),
      temperature: 0.8,
      max_tokens: 420,
      top_p: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  const text = extractText(response.data);

  if (!text) {
    return "I’m here with you. Tell me a little more about what has been feeling the hardest lately.";
  }

  return text;
}