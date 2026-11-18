import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import { sanitizeRedirect } from '@/app/lib/redirect'
import LoginForm from './login-form'

export const metadata: Metadata = {
  title: '登录',
}

// 登录页需要每次请求读取会话 Cookie（已登录则跳走），无法预渲染成静态壳，
// 故按 Cache Components 规则声明为阻塞渲染路由。
export const instant = false

export default async function LoginPage(props: PageProps<'/login'>) {
  const { redirect: redirectParam } = await props.searchParams
  const redirectTo = sanitizeRedirect(
    typeof redirectParam === 'string' ? redirectParam : undefined,
  )

  // 已登录用户直接跳走，避免重复登录
  const session = await getSession()
  if (session) {
    redirect(redirectTo)
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          登录
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          请输入用户名和密码继续
        </p>

        <LoginForm redirectTo={redirectTo} />
      </main>
    </div>
  )
}
