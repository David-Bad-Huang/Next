'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ error, retry, }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // 在这里接入错误上报服务
    console.error(error)
  }, [error])

  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <p className="text-4xl" aria-hidden>
          ⚠️
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
          出了点问题
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          页面加载时发生错误，可以尝试重试；如果问题持续出现，请稍后再访问。
        </p>

        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 h-11 w-full rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          重试
        </button>
        <Link
          href="/"
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          返回首页
        </Link>

        {digest && (
          <p className="mt-4 font-mono text-xs text-zinc-400 dark:text-zinc-600">
            错误编号：{digest}
          </p>
        )}
      </main>
    </div>
  )
}
