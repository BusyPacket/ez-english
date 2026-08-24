#!/usr/bin/env node
/**
 * 本地 CI 脚本：在本地模拟 CI 流水线，顺序执行全部质量检查。
 *
 * 用法（在项目根目录）：
 *   node scripts/ci.mjs                      # 完整检查（含依赖安装校验）
 *   node scripts/ci.mjs --skip-install       # 跳过依赖安装（本地已装好依赖时更快）
 *
 * 流水线步骤：
 *   1. pnpm install --frozen-lockfile   —— 校验 lockfile 与依赖一致性
 *   2. pnpm format:check                —— Prettier 格式化检查
 *   3. type-check（client/server/shared）—— TypeScript 类型检查
 *   4. pnpm lint                        —— oxlint 代码检查
 *   5. pnpm build                       —— 全量构建
 *
 * 任一步失败即终止并返回非零退出码，便于接入 Git hooks / 终端脚本。
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const skipInstall = process.argv.slice(2).includes('--skip-install')

/** 各步骤定义：[说明, 命令, 参数] */
const steps = []
if (!skipInstall) {
  steps.push([
    '安装依赖校验 (pnpm install --frozen-lockfile)',
    'pnpm',
    ['install', '--frozen-lockfile'],
  ])
}
steps.push(
  ['Prettier 格式化检查 (format:check)', 'pnpm', ['format:check']],
  // 必须先构建 shared：前端的 vue-tsc 依赖 @ez-english/shared 的 dist 类型声明（干净环境无残留产物）
  ['构建 shared（供前端类型解析）', 'pnpm', ['--filter', '@ez-english/shared', 'build']],
  ['类型检查 client (vue-tsc)', 'pnpm', ['--filter', 'client', 'type-check']],
  ['类型检查 server (tsc --noEmit)', 'pnpm', ['--filter', 'server', 'type-check']],
  ['类型检查 shared (tsc --noEmit)', 'pnpm', ['--filter', '@ez-english/shared', 'type-check']],
  ['Lint 检查 (oxlint)', 'pnpm', ['lint']],
  ['构建 (pnpm build)', 'pnpm', ['build']],
)

/**
 * 运行单个步骤，继承当前终端输出。
 * Windows 下 pnpm 是 .cmd 包装器，需要 shell 解释；
 * 为避免 Node 的 DEP0190 警告（shell: true + args 数组组合不安全），
 * 这里把参数拼进命令字符串后整体传给 shell。
 */
function run([label, command, args]) {
  return new Promise((resolve, reject) => {
    console.log(`\n━━━ ${label} ━━━`)
    const quote = (a) => (a.includes(' ') ? `"${a}"` : a)
    const fullCommand = [command, ...args.map(quote)].join(' ')
    const child = spawn(fullCommand, {
      cwd: root,
      stdio: 'inherit',
      shell: true,
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${label}`)
        resolve()
      } else {
        console.error(`❌ ${label} 失败（退出码 ${code}）`)
        reject(new Error(`${label} 失败（退出码 ${code}）`))
      }
    })
  })
}

console.log('🚀 开始本地 CI 检查')
console.log(`   工作目录: ${root}`)
if (skipInstall) console.log('   （已跳过依赖安装校验）')

try {
  for (const step of steps) {
    await run(step)
  }
  console.log('\n🎉 本地 CI 全部通过！')
} catch (err) {
  console.error(`\n💥 本地 CI 未通过：${err.message}`)
  process.exit(1)
}
