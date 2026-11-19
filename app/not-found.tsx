import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '页面不存在',
}

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <p className="text-6xl font-semibold tracking-tight text-black dark:text-zinc-50">
          404
        </p>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
          页面不存在
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          你访问的页面可能已被删除，或者地址输入有误。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          返回首页
        </Link>
      </main>
    </div>
  )
}
