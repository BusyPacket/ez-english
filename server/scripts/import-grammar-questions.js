// 导入「专升本英语.md」转换生成的语法例题到 questions 表（追加，不清空现有题目）
// 运行：在 server 目录执行 `node scripts/import-grammar-questions.js`
// ⚠️ 追加模式：重复运行会重复插入同批题目；如需重建请先清空 questions 表再跑 seed + 本脚本
// 题目数据源：server/scripts/generated-questions/01-noun.js ~ 20-others.js（由 subagent 按章节生成）
const { createClient } = require('@libsql/client')
const { randomUUID } = require('node:crypto')
const { join } = require('node:path')
const { readdirSync } = require('node:fs')

const client = createClient({
  url: `file:${join(process.cwd(), 'data', 'ez-english.db').replace(/\\/g, '/')}`,
})

const dir = join(process.cwd(), 'scripts', 'generated-questions')
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.js'))
  .sort()

const all = []
const errors = []
for (const f of files) {
  const mod = require(join(dir, f))
  const arr = Array.isArray(mod) ? mod : mod.QUESTIONS || []
  let idx = 0 // 文件内序号，用于均匀化答案分布
  for (const q of arr) {
    const type = q.type || 'single'
    const problems = []
    if (!q.pointId) problems.push('缺 pointId')
    if (!q.stem) problems.push('缺 stem')
    if (!q.answer) problems.push('缺 answer')
    const ch = Array.isArray(q.choices) ? q.choices : []
    if (type === 'single') {
      if (ch.length < 2) problems.push('single 缺选项')
      if (!/^[A-D]$/.test(String(q.answer).trim())) problems.push(`answer 非法(${q.answer})`)
      // 源数据质量校验：解析结论字母必须与 answer 一致。
      // 若 AI 生成时把「答案」与「解析结论」写岔，会在后续均匀化时被放大成
      // answer 与解析不一致，故此处直接判为校验失败（阻止导入并列出）。
      if (q.analysis) {
        const conclusion = String(q.analysis).match(
          /(?:故选|答案选|应选|所以选|因此选|选)\s*[（(]?\s*([A-D])\s*[)）]?/,
        )
        if (conclusion && conclusion[1] !== String(q.answer).trim().toUpperCase()) {
          problems.push(`解析结论(${conclusion[1]})与 answer(${q.answer})不一致`)
        }
      }
    } else if (type === 'judge') {
      if (!['正确', '错误'].includes(String(q.answer).trim()))
        problems.push(`judge answer 非法(${q.answer})`)
    }
    if (problems.length) {
      errors.push({ file: f, stem: String(q.stem).slice(0, 40), problems })
      continue
    }
    // 均匀化答案分布：按文件内序号轮转目标位置，重排选项并同步答案字母
    // （修复部分文件生成时答案集中在 A 的问题，避免学习者猜 A）
    // ⚠️ 重排必须同步映射 analysis 中指向旧选项位置的字母引用（A-D）：
    // 此前版本只更新 answer/choices，导致「answer 与解析结论」大面积不一致。
    if (type === 'single' && ch.length >= 2) {
      const target = idx % 4
      idx += 1
      const correctIdx = 'ABCD'.indexOf(String(q.answer).trim())
      const correct = correctIdx >= 0 ? ch[correctIdx] : ch[0]
      const rest = ch.filter((_, i) => i !== correctIdx)
      const newCh = []
      const oldToNew = new Array(4) // 旧选项位置(0-3) -> 新选项位置(0-3)
      for (let i = 0; i < 4; i++) {
        if (i === target) {
          newCh.push(correct)
          oldToNew[correctIdx] = i
        } else {
          const item = rest.shift()
          newCh.push(item)
          oldToNew[ch.indexOf(item)] = i
        }
      }
      q.answer = 'ABCD'[target]
      q.choices = newCh
      // 同步把 analysis 中所有选项字母引用（A-D）映射到新位置
      if (q.analysis) {
        q.analysis = String(q.analysis).replace(/[A-D]/g, (letter) => {
          const from = 'ABCD'.indexOf(letter)
          return 'ABCD'[oldToNew[from]]
        })
      }
    } else {
      q.choices = ch
    }
    all.push({ ...q, type, choices: q.choices })
  }
}

console.log('合并题目总数:', all.length)
console.log('校验失败:', errors.length)
errors
  .slice(0, 15)
  .forEach((e) => console.log('  ❌', e.file, '|', e.problems.join(';'), '|', e.stem))
if (errors.length) {
  console.log('存在校验失败，中止插入（未写入任何数据）')
  process.exit(1)
}

const byType = {}
const byPoint = {}
for (const q of all) {
  byType[q.type] = (byType[q.type] || 0) + 1
  byPoint[q.pointId] = (byPoint[q.pointId] || 0) + 1
}
console.log('按题型分布:', JSON.stringify(byType))
console.log('涉及考点数:', Object.keys(byPoint).length)

async function main() {
  // 追加插入（不清空现有题目）
  const createdAt = new Date().toISOString()
  let inserted = 0
  for (const q of all) {
    const choices = q.type === 'single' && q.choices.length ? JSON.stringify(q.choices) : '[]'
    await client.execute({
      sql: `INSERT INTO questions (id, type, point_id, point_title, stem, choices, answer, analysis, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        randomUUID(),
        q.type,
        q.pointId,
        q.pointTitle || null,
        q.stem,
        choices,
        String(q.answer).trim(),
        q.analysis || null,
        createdAt,
      ],
    })
    inserted += 1
  }
  const after = await client.execute('SELECT count(*) AS n FROM questions')
  console.log(`✅ 成功插入 ${inserted} 道题；questions 表现有总数: ${after.rows[0].n}`)
  process.exit(0)
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
