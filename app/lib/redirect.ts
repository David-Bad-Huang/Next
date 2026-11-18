/** 校验站内跳转地址，非法或为空时回退到 '/'，防止 open redirect */
export function sanitizeRedirect(target: string | undefined): string {
  if (!target) return '/'
  // 只允许站内相对路径，拒绝 //、/\ 等协议相对写法
  if (!target.startsWith('/') || target.startsWith('//')) return '/'
  // 不允许跳回登录页自身，否则会造成重定向循环
  if (target === '/login' || target.startsWith('/login?')) return '/'
  return target
}
