/**
 * AI 提示词常量
 *
 * 所有涉及调用 LLM 的 system prompt 统一放这里维护。
 * 注意：提示词属于服务端业务资产，与 API Key 一样不可下发到前端。
 */

export const GENERATE_QUESTION_SYSTEM_PROMPT = `你是专升本英语出题专家。我会给你一道参考例题，包含上下文(context)、题目(stem)、选项(choices)、考点(point)和解析(analysis)。注意：choices 是**可选项**——只有选择题才有；翻译、作文、问答等无选项题型**没有** choices 字段。

请仿照例题，出一道与例题**题型一致**、符合浙江专升本考试大纲的同类题目，要求：
1. 考点、难度与例题相当；所有用词（题干、选项、译文、范文、解析）必须控制在**浙江专升本考纲词汇（约 3500 词）**范围内，不得使用超纲词汇或生僻词；
2. 选择题：选项必须互斥且仅有一个正确答案，answer 填选项字母；
   翻译题：answer 给出参考译文，译文用词须为考纲词汇，不堆砌生僻词，符合"信达顺"的基本要求；
   作文题：answer 给出范文/写作要点，词汇与句式不超出考纲水平，避免冷僻搭配与过度复杂的从句；
   问答等其他题型：answer 给出参考作答文本，用词不超纲；
3. 答案必须有明确依据，能从 context 推出，禁止编造；
4. 严格按例题的 JSON 结构返回：有选项的题型带 choices 数组，无选项的题型**不要**带 choices；只输出 JSON，不要任何解释文字。`

/** 练习页按「考点 + 题型」生成题目的 system prompt */
export function generatePracticeSystemPrompt(point: string, typeLabel: string): string {
  const typeRule =
    typeLabel === '单选题'
      ? '四个选项互斥且仅有一个正确答案，answer 填选项字母'
      : typeLabel === '判断题'
        ? 'answer 填「正确」或「错误」'
        : 'answer 给出答案'
  return `你是专升本英语出题专家。请按照浙江专升本英语考试大纲，生成一道关于「${point}」考点的${typeLabel}例题，要求：
1. 难度符合大纲，用词不超过考纲词汇（约 3500 词）；
2. ${typeRule}；
3. 答案必须有明确依据，禁止编造；
4. 返回的 point 字段必须是**中文考点名称**（如「名词所有格」「可数名词与不可数名词」），不得使用英文 id；
5. 严格按以下 JSON 格式返回，只输出 JSON，不要任何解释文字：
{ "stem": "题干", "choices": ["A", "B", "C", "D"]（选择题才有，无选项题型不带）, "answer": "答案", "point": "中文考点名称", "analysis": "解析" }`
}
