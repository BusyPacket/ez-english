/**
 * 写作专项考点的知识讲解 + 示例（学习模式）
 * 仅前 4 个写作专项考点使用；「短文写作（完整作文）」走 AI 作文题 + 写作 + 点评
 */
export interface WritingLesson {
  pointId: string
  /** 一句话总述 */
  intro: string
  /** 知识点要点 */
  points: { title: string; content: string }[]
  /** 示例标题 */
  exampleTitle: string
  /** 示例内容（保留换行） */
  example: string
}

export const writingLessons: Record<string, WritingLesson> = {
  'writing-essay-structure': {
    pointId: 'writing-essay-structure',
    intro:
      '一篇合格的专升本英语作文通常采用「三段式」结构：开头引入观点、正文分点论证、结尾总结呼应。',
    points: [
      {
        title: '开头段（Introduction）',
        content:
          '用 1-3 句话引出话题，最后一句亮明你的观点或立场。常用句式：In my opinion, ... / As far as I am concerned, ...',
      },
      {
        title: '正文段（Body）',
        content: '通常写 2-3 段。每段以主题句（topic sentence）开头，再用 2-3 句话举例或论证展开。',
      },
      {
        title: '结尾段（Conclusion）',
        content:
          '用 1-2 句话重申观点、总结全文，或提出建议与展望。常用句式：In a word, ... / All in all, ...',
      },
    ],
    exampleTitle: '示例：The Importance of Reading',
    example: `Introduction: Reading plays an important role in our life. In my opinion, it brings us both knowledge and pleasure.

Body: First, reading helps us learn new things and broadens our horizons. For example, we can learn about other countries from books. Besides, reading is a good way to relax after a busy day.

Conclusion: In a word, reading is valuable to everyone. We should make it a good habit.`,
  },
  'writing-paragraph': {
    pointId: 'writing-paragraph',
    intro: '一个清晰的段落 = 主题句 + 支撑句。主题句点明中心，支撑句用举例、因果、对比等方式展开。',
    points: [
      {
        title: '主题句（Topic Sentence）',
        content: '通常放在段落第一句，点明本段要讲什么，让读者一眼抓住重点。',
      },
      {
        title: '支撑句（Supporting Sentences）',
        content:
          '用 2-3 句话展开主题，常见方式：举例（For example, ...）、因果（because, so）、对比（However, ...）、递进（Besides, ...）。',
      },
      {
        title: '常见错误',
        content: '一段只讲一个中心，不要写与主题句无关的内容；支撑句要具体，避免空泛。',
      },
    ],
    exampleTitle: '示例：主题句 + 支撑句',
    example: `Topic sentence: There are several reasons why I like English.

Supporting: First, English is useful in daily life. For example, we can read English news and watch English movies. Besides, learning English helps us make friends from other countries.`,
  },
  'writing-connective': {
    pointId: 'writing-connective',
    intro: '衔接词让句子之间的逻辑关系清晰，行文更连贯。掌握四类常用衔接词即可应对大部分作文。',
    points: [
      { title: '并列 / 递进', content: 'and, also, moreover, besides, what is more' },
      { title: '转折', content: 'but, however, on the other hand, although / though' },
      { title: '因果', content: 'so, therefore, as a result, because, since' },
      { title: '顺序 / 列举', content: 'first, second, then, finally, in addition' },
    ],
    exampleTitle: '示例：使用衔接词的段落',
    example: `First, we should make a clear plan. Then, we can finish the work step by step. However, we may meet some difficulties. Therefore, we need to keep trying and ask others for help when necessary.`,
  },
  'writing-sentence-variety': {
    pointId: 'writing-sentence-variety',
    intro: '全篇都用简单句会显得单调。适当变换句式（长短结合、从句、强调句等）能让作文更出彩。',
    points: [
      {
        title: '长短句结合',
        content: '不要全用短句；偶尔用定语从句、宾语从句等让句子更丰富，但注意别堆砌过长从句。',
      },
      {
        title: '常用高级结构',
        content:
          '强调句 It is ... that ...、并列结构 Not only ... but also ...、被动语态、比较级等。',
      },
      {
        title: '避免中式表达',
        content: '注意主谓一致、时态统一、冠词使用，避免直译造成的中式英语。',
      },
    ],
    exampleTitle: '示例：句式改写前后对比',
    example: `Simple: He studies hard. He also helps others.

Improved: Not only does he study hard, but he also helps others.

Simple: We should protect the environment.

Improved: It is important that we should protect the environment.`,
  },
}
