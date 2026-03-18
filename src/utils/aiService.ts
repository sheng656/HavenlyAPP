import type { AgeGroup, ChatMessage } from '../types';
import { isCrisisMessage, CRISIS_RESPONSE, AI_RESPONSES, DEFAULT_AI_RESPONSES } from './moodData';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
const API_ENDPOINT = 'https://models.inference.ai.azure.com';
const MODEL = 'gpt-4o-mini';

function getSystemPrompt(ageGroup: AgeGroup): string {
  const base =
    '你是"岛岛"，一只温柔、充满爱心的小企鹅，是用户的心情陪伴助手。你的职责是倾听、安慰和支持，绝不给出医疗建议，也绝不讨论任何危险话题。始终用中文回复。回复简短而温暖，不超过80个字。';
  switch (ageGroup) {
    case 'toddler':
      return `${base}你正在和一个很小的宝宝说话（3-5岁）。使用非常简单的词汇，多用表情符号，语气超级温柔像在哄小宝宝。`;
    case 'teen':
      return `${base}你正在和一个青少年（13-18岁）说话。语气真诚、平等，不说教，理解他们面对的学业压力和成长困惑，可以适度深入反思。`;
    default:
      return `${base}你正在和一个小朋友（6-12岁）说话。语气活泼、鼓励，使用适合儿童的词汇，帮助他们认识和表达情绪。`;
  }
}

function getFallbackResponse(ageGroup: AgeGroup, lastMoodId?: string | null): string {
  if (ageGroup === 'toddler') {
    const simple = ['抱抱你 🫂', '摸摸头 👋', '我在呢 💙', '别怕别怕 🛡️', '你最棒了 🌟'];
    return simple[Math.floor(Math.random() * simple.length)];
  }
  if (lastMoodId && AI_RESPONSES[lastMoodId]) {
    const arr = AI_RESPONSES[lastMoodId];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return DEFAULT_AI_RESPONSES[Math.floor(Math.random() * DEFAULT_AI_RESPONSES.length)];
}

/**
 * Returns an AI response. Uses GitHub Models API if VITE_GITHUB_TOKEN is set,
 * otherwise falls back to curated mock responses.
 */
export async function getAIResponse(
  userText: string,
  ageGroup: AgeGroup,
  lastMoodId?: string | null,
  history?: ChatMessage[],
): Promise<string> {
  if (isCrisisMessage(userText)) return CRISIS_RESPONSE;

  if (GITHUB_TOKEN) {
    try {
      const historyMessages = (history ?? [])
        .slice(-8)
        .map((m) => ({
          role: m.role === 'ai' ? ('assistant' as const) : ('user' as const),
          content: m.content,
        }));

      const response = await fetch(`${API_ENDPOINT}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: getSystemPrompt(ageGroup) },
            ...historyMessages,
            { role: 'user', content: userText },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          choices: Array<{ message: { content: string } }>;
        };
        const content = data.choices[0]?.message?.content;
        if (content) return content;
      }
    } catch (err) {
      console.warn('[AI] API call failed, using fallback:', err);
    }
  }

  return getFallbackResponse(ageGroup, lastMoodId);
}
