import { getSession } from '@/app/lib/session'
import { logout } from '@/app/actions/auth'

/** 已登录时显示的登出按钮，未登录渲染 null */
export default async function LogoutButton() {
  const session = await getSession()
  if (!session) return null

  return (
    <form action={logout} className="absolute right-4 top-4">
      <button
        type="submit"
        className="rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      >
        退出登录（{session.username}）
      </button>
    </form>
  )
}
