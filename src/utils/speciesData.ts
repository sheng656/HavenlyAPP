export interface SpeciesData {
  id: string;
  emoji: string;
  name: string;
  nameEn: string;
  kind: 'pet' | 'plant';
  bioFact: string;
  bioFactEn: string;
  psychInsight: string;
  psychInsightEn: string;
  psychMetaphor: string;
  psychMetaphorEn: string;
}

export const SPECIES_DATA: Record<string, SpeciesData> = {
  // Pets
  penguin: {
    id: 'penguin',
    emoji: '🐧',
    name: '小企鹅',
    nameEn: 'Penguin',
    kind: 'pet',
    bioFact: '企鹅是极少数终身与同一伴侣相伴的动物。每年，它们都能在数千只企鹅中通过独特的叫声认出彼此。',
    bioFactEn: 'Penguins are among the few animals that can stay with the same partner for many seasons. They can recognize each other in huge colonies by unique calls.',
    psychInsight: '真正的陪伴，不需要语言，只需要彼此认识的心。',
    psychInsightEn: 'Real companionship is not about perfect words, but about truly knowing each other.',
    psychMetaphor: '就像企鹅穿越风雪也要归队，你心里最重要的人，值得你一次次走回去。',
    psychMetaphorEn: 'Like penguins returning through wind and snow, people who matter are worth returning to again and again.',
  },
  cat: {
    id: 'cat',
    emoji: '🐱',
    name: '小猫咪',
    nameEn: 'Kitty',
    kind: 'pet',
    bioFact: '猫咪每天睡眠长达12–16小时，这不是懒惰，而是它们高效狩猎生活方式进化出的充电模式。',
    bioFactEn: 'Cats sleep 12-16 hours a day. It is not laziness, but an energy strategy shaped by evolution.',
    psychInsight: '休息是能量的储存，不是时间的浪费。',
    psychInsightEn: 'Rest stores energy. It is not wasted time.',
    psychMetaphor: '像猫一样允许自己好好休息吧。充足的睡眠和放松，是迎接每一个明天最好的准备。',
    psychMetaphorEn: 'Like a cat, allow yourself to rest. Good sleep and pause are preparation for tomorrow.',
  },
  bunny: {
    id: 'bunny',
    emoji: '🐰',
    name: '小兔子',
    nameEn: 'Bunny',
    kind: 'pet',
    bioFact: '兔子感到危险时会用后腿用力跺地，这种震动信号能迅速传遍整个兔群，是一种无声的求助语言。',
    bioFactEn: 'When rabbits sense danger, they thump the ground with their back legs. This vibration quickly warns the group.',
    psychInsight: '寻求帮助不是软弱，是对自己和他人的信任。',
    psychInsightEn: 'Asking for help is not weakness. It is trust in yourself and others.',
    psychMetaphor: '当你感到害怕或压力太大，学习小兔子——给身边信任的人一个信号，让他们知道你需要被陪伴。',
    psychMetaphorEn: 'When fear or pressure grows, be like a bunny: send a signal to someone you trust and let them stay with you.',
  },
  bear: {
    id: 'bear',
    emoji: '🐻',
    name: '小熊',
    nameEn: 'Bear',
    kind: 'pet',
    bioFact: '熊冬眠时心跳从每分钟55次降至9次，体温微降，却能维持数月生命，等待春天到来。',
    bioFactEn: 'During hibernation, a bear\'s heartbeat slows dramatically and it can sustain itself for months while waiting for spring.',
    psychInsight: '减速，不是放弃；沉睡，是为了更好地醒来。',
    psychInsightEn: 'Slowing down is not giving up. Rest can be preparation for a stronger return.',
    psychMetaphor: '当你感到筋疲力尽，允许自己像熊一样进入一段"冬眠"。好好休息，春天一定会来。',
    psychMetaphorEn: 'When exhausted, allow yourself a bear-like "hibernation". Rest well. Spring still comes.',
  },
  // Plants
  sunflower: {
    id: 'sunflower',
    emoji: '🌻',
    name: '向日葵',
    nameEn: 'Sunflower',
    kind: 'plant',
    bioFact: '向日葵在幼年期会随太阳转动，成熟后固定朝向东方——因为清晨的阳光吸引最多授粉昆虫，这是它进化出的生存智慧。',
    bioFactEn: 'Young sunflowers track the sun. Mature ones face east to catch early light and attract pollinators.',
    psychInsight: '转向光明，是一种生命的本能。',
    psychInsightEn: 'Turning toward light is a life instinct.',
    psychMetaphor: '即使周围有阴影，也试着把脸转向能让你感到温暖的那个方向。光，总在某处等着你。',
    psychMetaphorEn: 'Even with shadows around you, turn toward what feels warm. Light is still waiting somewhere.',
  },
  rose: {
    id: 'rose',
    emoji: '🌹',
    name: '玫瑰花',
    nameEn: 'Rose',
    kind: 'plant',
    bioFact: '玫瑰的刺学名叫"皮刺"，是茎表皮的延伸，专门为了防御而生——它从不主动攻击，只是守护自己。',
    bioFactEn: 'Rose thorns are protective structures. They are for defense, not attack.',
    psychInsight: '设立边界，不是为了伤人，是为了保护内心最珍贵的部分。',
    psychInsightEn: 'Setting boundaries is not hurting others. It protects what matters in you.',
    psychMetaphor: '你有权利说"不"。就像玫瑰的刺一样，守护自己的边界，是对自己最深的爱。',
    psychMetaphorEn: 'You have the right to say "no". Like rose thorns, boundaries are an act of self-respect.',
  },
  cactus: {
    id: 'cactus',
    emoji: '🌵',
    name: '仙人掌',
    nameEn: 'Cactus',
    kind: 'plant',
    bioFact: '仙人掌把叶片进化成刺以减少水分蒸发，用肥厚的茎储存水分——在最极端的干旱中，它依然能够开花。',
    bioFactEn: 'Cacti evolved spines and water-storing stems, allowing them to bloom even in extreme dryness.',
    psychInsight: '坚韧不是没有感受，而是带着感受继续生长。',
    psychInsightEn: 'Resilience is not numbness. It is growing while still feeling.',
    psychMetaphor: '你也可以在艰难的环境里开出属于自己的花。不需要完美的条件，只需要你内心那一点不放弃的力气。',
    psychMetaphorEn: 'You can bloom in hard conditions too. You do not need perfect circumstances, just steady courage.',
  },
  mushroom: {
    id: 'mushroom',
    emoji: '🍄',
    name: '蘑菇',
    nameEn: 'Mushroom',
    kind: 'plant',
    bioFact: '蘑菇地下的菌丝网络能连接整片森林，在树木之间传递养分和化学信号——科学家称它为"森林互联网"。',
    bioFactEn: 'Underground fungal networks connect forests and transfer nutrients and signals between plants.',
    psychInsight: '我们彼此相连，比我们以为的更深。',
    psychInsightEn: 'We are more connected than we think.',
    psychMetaphor: '就像菌丝悄悄滋养整片森林，你平时对别人的一点温柔，也在默默支撑着他们。你不是孤岛。',
    psychMetaphorEn: 'Like mycelium quietly feeding a forest, your small kindness can support others deeply. You are not an island.',
  },
};
