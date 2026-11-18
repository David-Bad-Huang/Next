import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { connection } from 'next/server'

const SESSION_COOKIE = 'session'
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 天

export type SessionPayload = {
  userId: string
  username: string
  /** 过期时间（Unix 秒） */
  exp: number
}

type SessionInput = Pick<SessionPayload, 'userId' | 'username'>

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('缺少 SESSION_SECRET 环境变量，请在 .env 中配置')
  }
  return secret
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url')
}

/** 将会话数据编码为「载荷.签名」格式的令牌 */
function encodeSession(payload: SessionInput): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp }),
  ).toString('base64url')
  return `${body}.${sign(body)}`
}

/** 校验并解码令牌，签名不匹配或已过期时返回 null */
function decodeSession(token: string | undefined): SessionPayload | null {
  if (!token) return null

  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return null

  const body = token.slice(0, dotIndex)
  const signature = token.slice(dotIndex + 1)
  const expected = sign(body)

  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8'),
    ) as SessionPayload

    if (
      !payload.userId ||
      typeof payload.exp !== 'number' ||
      payload.exp * 1000 < Date.now()
    ) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

/** 创建会话（写入 HttpOnly Cookie），只能在 Server Action / Route Handler 中调用 */
export async function createSession(payload: SessionInput): Promise<void> {
  const token = encodeSession(payload)
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + SESSION_TTL_SECONDS * 1000),
    sameSite: 'lax',
    path: '/',
  })
}

/** 读取当前会话，未登录或会话无效时返回 null。
 *  仅可在阻塞渲染路由（instant = false）或 Server Action / Route Handler 中使用。 */
export async function getSession(): Promise<SessionPayload | null> {
  // 过期检查依赖当前时间，必须推迟到请求时执行（Cache Components 要求），
  // 同时避免预取/预渲染通道触发 Date.now() 不稳定值错误。
  await connection()
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return decodeSession(token)
}

/** 删除会话（登出），只能在 Server Action / Route Handler 中调用 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
