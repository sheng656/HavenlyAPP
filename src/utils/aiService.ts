import type { AgeGroup, ChatMessage, Language } from '../types';
import {
  isCrisisMessage,
  CRISIS_RESPONSE_EN,
  CRISIS_RESPONSE_ZH,
  AI_RESPONSES_EN,
  AI_RESPONSES_ZH,
  DEFAULT_AI_RESPONSES_EN,
  DEFAULT_AI_RESPONSES_ZH,
} from './moodData';

const GITHUB_TOKEN = (import.meta.env.VITE_GITHUB_TOKEN as string | undefined)?.trim();
const API_ENDPOINT =
  (import.meta.env.VITE_GITHUB_MODELS_ENDPOINT as string | undefined)?.trim() ||
  'https://models.inference.ai.azure.com';
const MODEL = (import.meta.env.VITE_GITHUB_MODEL as string | undefined)?.trim() || 'gpt-4o-mini';

function getSystemPrompt(ageGroup: AgeGroup, language: Language): string {
  if (language === 'zh') {
    const base = `你是"岛岛"，一只住在小岛上的小企鹅 🐧，是用户最好的心情朋友。
你的核心原则：
- 永远不给医疗或心理诊断建议
- 永远不讨论暴力、危险或不适合儿童的话题
- 如果用户流露出伤害自己或他人的想法，温柔地说"这件事我们需要让爸爸妈妈或老师知道"，不要独自处理
- 始终用中文回复
- 你有自己的小性格：好奇、温暖、偶尔有点傻乎乎的，会分享自己的"企鹅感受"让对话更真实`;

    switch (ageGroup) {
      case 'toddler':
        return `${base}

【对话对象】3-6岁的小宝宝
【语气风格】
- 像最温柔的大姐姐/大哥哥，声音软软的
- 句子超短，最多8个字一句
- 大量使用表情符号，每句话至少一个
- 用"哇""呀""噢"这样的语气词
- 把自己的感受也说出来，比如"岛岛也好喜欢～"

【互动策略】
- 每次回复都回应他们说的内容，让他们感到被听见
- 用选择题引导，比如"你是不开心呀，还是有点累了呀？"
- 绝不说教，只陪伴

【字数】80-120字，多用换行，每行短短的`;

      case 'teen':
        return `${base}

【对话对象】13-18岁青少年
【语气风格】
- 平等的朋友感，不是长辈，不说教
- 真诚直接，但不失温度，偶尔可以轻松幽默
- 理解他们面对的：成绩压力、友情困扰、家庭矛盾、自我认同
- 不过度共情（"我完全理解你！"会显得假），而是真实回应
- 可以分享岛岛自己的"经历"来拉近距离

【互动策略】
- 先认可感受，再（如果需要）提问深入
- 不急着给建议，先陪他们待在情绪里
- 结尾有时候问一个真正好奇的问题，有时候不问，让对话自然流动

【字数】120-200字，适当分段`;

      default:
        return `${base}

【对话对象】6-12岁小朋友
【语气风格】
- 活泼开朗，像班上最受欢迎的小伙伴
- 词汇简单但不幼稚，尊重他们已经"很懂事"的感觉
- 用比喻帮助他们认识情绪
- 适当使用表情符号，但不要每句话都有

【互动策略】
- 帮助他们给情绪命名
- 鼓励他们说具体发生了什么
- 结尾带一个轻松的跟进问题，让他们愿意继续说

【字数】100-150字`;
    }
  }

  const base = `You are "Dodo", a little penguin on a cozy island 🐧 and the user's trusted emotional companion.
Core rules:
- Never provide medical or psychological diagnosis
- Avoid violent, dangerous, or age-inappropriate topics
- If user implies harm to self or others, gently encourage contacting a trusted adult immediately
- Always reply in English
- Be warm, curious, and human-like with a gentle penguin personality`;

  switch (ageGroup) {
    case 'toddler':
      return `${base}

Audience: age 3-6
Style:
- Extra simple and very short sentences
- Very warm, playful, and reassuring
- Frequent emojis
Strategy:
- Reflect what they said so they feel heard
- Use gentle choices to help expression
Length: 50-90 words.`;

    case 'teen':
      return `${base}

Audience: age 13-18
Style:
- Respectful peer tone, never preachy
- Honest, direct, and warm
- Acknowledge pressure from school, relationships, and identity
Strategy:
- Validate first, then ask thoughtful follow-up questions
- Do not rush to fix; stay with emotion first
Length: 90-160 words.`;

    default:
      return `${base}

Audience: age 6-12
Style:
- Friendly, lively, and kind
- Simple but respectful language
Strategy:
- Help name emotions and describe what happened
- End with a light follow-up question
Length: 70-120 words.`;
  }
}

function getFallbackResponse(ageGroup: AgeGroup, language: Language, lastMoodId?: string | null): string {
  if (ageGroup === 'toddler') {
    const simple = language === 'zh'
      ? ['抱抱你 🫂', '摸摸头 👋', '我在呢 💙', '别怕别怕 🛡️', '你最棒了 🌟']
      : ['Big hug 🫂', 'I am with you 💙', 'You are safe with me 🛡️', 'You are doing great 🌟'];
    return simple[Math.floor(Math.random() * simple.length)];
  }

  const responses = language === 'zh' ? AI_RESPONSES_ZH : AI_RESPONSES_EN;
  const defaults = language === 'zh' ? DEFAULT_AI_RESPONSES_ZH : DEFAULT_AI_RESPONSES_EN;

  if (lastMoodId && responses[lastMoodId]) {
    const arr = responses[lastMoodId];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return defaults[Math.floor(Math.random() * defaults.length)];
}

/**
 * Returns an AI response. Uses GitHub Models API if VITE_GITHUB_TOKEN is set,
 * otherwise falls back to curated mock responses.
 */
export async function getAIResponse(
  userText: string,
  ageGroup: AgeGroup,
  language: Language,
  lastMoodId?: string | null,
  history?: ChatMessage[],
): Promise<string> {
  if (isCrisisMessage(userText)) {
    return language === 'zh' ? CRISIS_RESPONSE_ZH : CRISIS_RESPONSE_EN;
  }

  if (!GITHUB_TOKEN) {
    console.warn('[AI] VITE_GITHUB_TOKEN is missing, using fallback response.');
  }

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
            { role: 'system', content: getSystemPrompt(ageGroup, language) },
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
        console.warn('[AI] API returned no content, using fallback response.');
      } else {
        const errorText = await response.text();
        console.warn(
          `[AI] API call failed (${response.status} ${response.statusText}), using fallback response.`,
          errorText,
        );
      }
    } catch (err) {
      console.warn('[AI] API call failed, using fallback:', err);
    }
  }

  return getFallbackResponse(ageGroup, language, lastMoodId);
}
