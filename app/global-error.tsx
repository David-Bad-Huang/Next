'use client'

// 根布局出错时兜底的错误页：会替换根布局，必须自带 html/body 和全局样式
import './globals.css'

export default function GlobalError({ retry, }: { error: unknown; retry: () => void }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <title>出错了</title>
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
          <main className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
            <p className="text-4xl" aria-hidden>
              ⚠️
            </p>
            <h1 className="mt-3 text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
              应用出错了
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              页面加载时发生严重错误，请尝试重试。
            </p>
            <button
              type="button"
              onClick={() => retry()}
              className="mt-6 h-11 w-full rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              重试
            </button>
          </main>
        </div>
      </body>
    </html>
  )
}
