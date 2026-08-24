// 一键统一所有 package.json 的版本号（根 + client + server + packages/shared）
// 用法：node scripts/set-version.mjs <版本号>
// 示例：node scripts/set-version.mjs 0.1.0   （或 pnpm set-version 0.1.0）
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const version = process.argv[2]

if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z-.]+)?$/.test(version)) {
  console.error('用法: node scripts/set-version.mjs <版本号>')
  console.error('示例: node scripts/set-version.mjs 0.1.0  →  将所有包统一为 0.1.0')
  process.exit(1)
}

const pkgFiles = [
  join(root, 'package.json'),
  join(root, 'client', 'package.json'),
  join(root, 'server', 'package.json'),
  join(root, 'packages', 'shared', 'package.json'),
]

for (const file of pkgFiles) {
  const pkg = JSON.parse(readFileSync(file, 'utf8'))
  const old = pkg.version
  pkg.version = version
  // 保持 2 空格缩进 + 末尾换行，字段顺序不变
  writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
  console.log(`✅ ${pkg.name ?? file}  ${old ?? '-'} → ${version}`)
}

console.log(`\n已统一为 v${version}。如需同步 pnpm-lock.yaml，请运行: pnpm install`)
