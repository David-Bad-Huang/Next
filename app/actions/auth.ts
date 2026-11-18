'use server'

import { redirect } from 'next/navigation'
import { verifyCredentials } from '@/app/lib/users'
import { createSession, deleteSession } from '@/app/lib/session'
import { sanitizeRedirect } from '@/app/lib/redirect'

export type LoginFormState = {
  /** 显示在表单顶部的整体错误信息 */
  message?: string
} | undefined

export async function login(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const redirectTo = sanitizeRedirect(String(formData.get('redirectTo') ?? ''))

  if (!username) return { message: '请输入用户名' }
  if (!password) return { message: '请输入密码' }

  const user = verifyCredentials(username, password)
  if (!user) {
    return { message: '用户名或密码错误' }
  }

  await createSession({ userId: user.id, username: user.username })

  // 登录成功，跳回来源页（redirect 会抛出框架控制的异常，无需 return）
  redirect(redirectTo)
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/login')
}
