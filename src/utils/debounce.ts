// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): T & { cancel: () => void; flush: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }) as T & { cancel: () => void; flush: () => void }

  debounced.cancel = () => {
    if (timer) clearTimeout(timer), (timer = null)
  }

  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer)
      fn(undefined as any) // 触发一次
      timer = null
    }
  }

  return debounced
}