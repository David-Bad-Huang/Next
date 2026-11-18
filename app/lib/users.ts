import 'server-only'
import { createHash, timingSafeEqual } from 'node:crypto'

export type User = {
  id: string
  username: string
  /** sha256(username:password) 的十六进制值 */
  passwordHash: string
}

// ⚠️ 演示用的内存用户表，密码为明文仅用于初始化哈希。
// 接入真实用户体系时，请替换为数据库查询 + scrypt/bcrypt 等慢哈希校验。
const DEMO_USERS: Array<{ id: string; username: string; password: string }> = [
  { id: '1', username: 'admin', password: '123456' },
  { id: '2', username: 'demo', password: 'demo123' },
]

function hashPassword(username: string, password: string): string {
  return createHash('sha256')
    .update(`${username}:${password}`)
    .digest('hex')
}

const USERS: User[] = DEMO_USERS.map(({ id, username, password }) => ({
  id,
  username,
  passwordHash: hashPassword(username, password),
}))

export function findUserByUsername(username: string): User | undefined {
  return USERS.find(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  )
}

/** 校验账号密码，成功返回用户，失败返回 null */
export function verifyCredentials(
  username: string,
  password: string,
): User | null {
  const user = findUserByUsername(username)
  if (!user) return null

  const a = Buffer.from(hashPassword(username, password), 'hex')
  const b = Buffer.from(user.passwordHash, 'hex')
  return a.length === b.length && timingSafeEqual(a, b) ? user : null
}
