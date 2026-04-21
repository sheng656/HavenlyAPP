import type { Mood, MoodId, Language } from '../types';

export const MOODS: Mood[] = [
  { id: 'happy', emoji: '😊', label: '开心', labelEn: 'Happy', color: '#FFD93D', intensity: 4 },
  { id: 'excited', emoji: '🤩', label: '兴奋', labelEn: 'Excited', color: '#FF6B6B', intensity: 5 },
  { id: 'calm', emoji: '😌', label: '平静', labelEn: 'Calm', color: '#95E1D3', intensity: 3 },
  { id: 'loved', emoji: '🥰', label: '被爱', labelEn: 'Loved', color: '#F38181', intensity: 4 },
  { id: 'sad', emoji: '😢', label: '难过', labelEn: 'Sad', color: '#6C9BCF', intensity: 2 },
  { id: 'angry', emoji: '😠', label: '生气', labelEn: 'Angry', color: '#FF5733', intensity: 1 },
  { id: 'anxious', emoji: '😰', label: '焦虑', labelEn: 'Anxious', color: '#B8A9C9', intensity: 2 },
  { id: 'scared', emoji: '😨', label: '害怕', labelEn: 'Scared', color: '#9EA9F0', intensity: 1 },
  { id: 'tired', emoji: '😴', label: '累了', labelEn: 'Tired', color: '#A8B3CF', intensity: 2 },
  { id: 'confused', emoji: '😕', label: '迷茫', labelEn: 'Confused', color: '#D4A5A5', intensity: 2 },
];

export const getMoodById = (id: MoodId): Mood | undefined =>
  MOODS.find((m) => m.id === id);

export const getMoodLabel = (mood: Mood, language: Language): string =>
  language === 'zh' ? mood.label : mood.labelEn;

export const getPositiveMoods = (): Mood[] =>
  MOODS.filter((m) => ['happy', 'excited', 'calm', 'loved'].includes(m.id));

export const getNegativeMoods = (): Mood[] =>
  MOODS.filter((m) => ['sad', 'angry', 'anxious', 'scared', 'tired', 'confused'].includes(m.id));

export const CRISIS_KEYWORDS = [
  '不想活', '自杀', '死', '消失', '痛苦', '再也不想', '不想了', '伤害自己',
  'hurt myself', 'want to die', 'suicide', 'kill myself', 'end it all',
];

export const isCrisisMessage = (text: string): boolean =>
  CRISIS_KEYWORDS.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));

export const AI_RESPONSES_ZH: Record<string, string[]> = {
  happy: [
    '真棒！听到你今天很开心，我也替你高兴 😊 能告诉我是什么让你这么开心吗？',
    '太好了！开心的感觉真的很美好。继续保持这种好心情吧！',
  ],
  excited: [
    '哇！你今天好兴奋呀！是发生了什么特别的事情吗？',
    '你的兴奋劲儿感染了我！快告诉我是什么让你这么激动？',
  ],
  calm: [
    '平静是一种很宝贵的感受 😌 你现在感觉很安稳，这很好。',
    '平静的心情让我们能更清晰地思考。享受这美好的时刻吧。',
  ],
  loved: [
    '被爱的感觉真的很温暖 🥰 你知道吗，你也是很值得被爱的！',
    '爱是世界上最美好的事情之一。感受到爱真是太幸福了！',
  ],
  sad: [
    '我知道难过的感觉很不好受 😢 没关系，我在这里陪着你。你愿意告诉我发生了什么吗？',
    '难过是很正常的情绪。允许自己难过，然后慢慢来。我在这里。',
  ],
  angry: [
    '生气是很正常的 😤 深呼吸一下，慢慢来。能告诉我是什么让你生气了吗？',
    '我理解你的愤怒。有时候事情真的会让人很抓狂。我们来聊聊看？',
  ],
  anxious: [
    '焦虑的感觉很累对吗？先试试深呼吸：吸气4秒，屏息4秒，呼气4秒 🫁',
    '焦虑会让人很不舒服。你不需要一个人扛着，我们可以一起想想办法。',
  ],
  scared: [
    '感到害怕是很勇敢的，因为你愿意正视自己的感受 💪 告诉我是什么让你害怕了？',
    '害怕没什么不好意思的。我在这里，你是安全的。',
  ],
  tired: [
    '累了就好好休息一下吧 😴 你的身体在告诉你它需要关爱。',
    '累的感觉很真实。好好照顾自己，休息是很重要的事情。',
  ],
  confused: [
    '迷茫的时候很正常，很多事情都需要时间才能想清楚 💭',
    '感到迷茫说明你在认真思考。我们可以一起来梳理一下你的想法。',
  ],
};

export const AI_RESPONSES_EN: Record<string, string[]> = {
  happy: [
    'That is wonderful to hear. I am really happy for you. Want to tell me what made your day feel good?',
  ],
  excited: [
    'You sound excited and full of energy. What happened?',
  ],
  calm: [
    'Feeling calm is precious. I am glad you have this steady moment.',
  ],
  loved: [
    'Feeling loved can be so warm and safe. You deserve that feeling.',
  ],
  sad: [
    'I am sorry you are feeling sad. I am here with you, and you do not have to carry it alone.',
  ],
  angry: [
    'Feeling angry makes sense. Let us slow down together and talk through what happened.',
  ],
  anxious: [
    'Anxiety can feel heavy. Try a slow breath with me: in for 4, hold for 4, out for 4.',
  ],
  scared: [
    'It is okay to feel scared. Thank you for sharing it. You are not alone right now.',
  ],
  tired: [
    'Being tired is real. Rest is not a weakness, it is care for yourself.',
  ],
  confused: [
    'Feeling confused is normal when things are complicated. We can sort it out one step at a time.',
  ],
};

export const DEFAULT_AI_RESPONSES_ZH = [
  '我在这里，你说。',
  '谢谢你愿意和我分享 💙',
  '你愿意多告诉我一些吗？',
  '我听到你了。感觉怎么样？',
];

export const DEFAULT_AI_RESPONSES_EN = [
  'I am here with you. Tell me more when you are ready.',
  'Thank you for sharing this with me 💙',
  'Would you like to tell me a little more?',
  'I hear you. How does it feel right now?',
];

export const CRISIS_RESPONSE_ZH =
  '我注意到你说的话让我很担心你 💙 你不是一个人。如果你现在很痛苦，请告诉一个你信任的大人，或者拨打心理援助热线：**北京 010-82951332 · 全国 400-161-9995**。我一直在这里陪着你。';

export const CRISIS_RESPONSE_EN =
  'I am really concerned about your safety 💙 You are not alone. Please tell a trusted adult right now, or contact a local crisis hotline in your area. If there is immediate danger, call your local emergency number now.';
