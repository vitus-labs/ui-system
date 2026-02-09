// --------------------------------------------------------
// omit — create a new object without the specified keys.
// Accepts nullable input for convenience (returns `{}`).
// Uses a Set for O(1) key lookup.
// --------------------------------------------------------
export const omit = <T extends Record<string, any>>(
  obj: T | null | undefined,
  keys?: readonly (string | keyof T)[],
): Partial<T> => {
  if (obj == null) return {} as Partial<T>
  if (!keys || keys.length === 0) return { ...obj }

  const result: Record<string, any> = {}
  const keysSet = new Set(keys as readonly string[])

  for (const key in obj) {
    if (Object.hasOwn(obj, key) && !keysSet.has(key)) {
      result[key] = obj[key]
    }
  }

  return result as Partial<T>
}

// --------------------------------------------------------
// pick — create a new object with only the specified keys.
// Accepts nullable input for convenience (returns `{}`).
// When no keys given, returns a shallow copy of the whole object.
// --------------------------------------------------------
export const pick = <T extends Record<string, any>>(
  obj: T | null | undefined,
  keys?: readonly (string | keyof T)[],
): Partial<T> => {
  if (obj == null) return {} as Partial<T>
  if (!keys || keys.length === 0) return { ...obj }

  const result: Record<string, any> = {}

  for (const key of keys) {
    const k = key as string
    if (Object.hasOwn(obj, k)) {
      result[k] = obj[k]
    }
  }

  return result as Partial<T>
}

// --------------------------------------------------------
// get — retrieve a nested value by dot/bracket path.
// e.g. get(obj, 'a.b.c') or get(obj, 'a.children[0]')
// Returns `defaultValue` when any segment is null/undefined.
// --------------------------------------------------------
const PATH_RE = /[^.[\]]+/g

/** Split a dot/bracket path string into individual key tokens. */
const parsePath = (path: string | string[]): string[] => {
  if (Array.isArray(path)) return path
  const parts = path.match(PATH_RE)
  return parts ?? []
}

export const get = (
  obj: any,
  path: string | string[],
  defaultValue?: any,
): any => {
  const keys = parsePath(path)
  let result = obj

  for (const key of keys) {
    if (result == null) return defaultValue
    result = result[key]
  }

  return result === undefined ? defaultValue : result
}

// --------------------------------------------------------
// set — set a nested value by path (mutates the object).
// Auto-creates intermediate objects/arrays as needed.
// Blocks prototype-pollution keys (__proto__, constructor, prototype).
// --------------------------------------------------------
const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor'])

export const set = (
  obj: Record<string, any>,
  path: string | string[],
  value: any,
): Record<string, any> => {
  const keys = parsePath(path)
  if (keys.some((k) => UNSAFE_KEYS.has(k))) return obj

  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!
    const nextKey = keys[i + 1]!

    if (current[key] == null) {
      // create array if next key is numeric, otherwise object
      current[key] = /^\d+$/.test(nextKey) ? [] : {}
    }

    current = current[key]
  }

  const lastKey = keys[keys.length - 1]
  if (lastKey != null) {
    current[lastKey] = value
  }

  return obj
}

// --------------------------------------------------------
// throttle — limit function execution to at most once per `wait` ms.
// Trailing calls are preserved: if called during the cooldown, the
// last invocation fires after the remaining delay.
// Returns a throttled function with a `.cancel()` method to clear
// any pending trailing call.
// --------------------------------------------------------
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 0,
): T & { cancel: () => void } => {
  let lastCallTime: number | undefined
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: any[] | undefined

  const throttled = (...args: any[]) => {
    const now = Date.now()

    if (lastCallTime === undefined || now - lastCallTime >= wait) {
      lastCallTime = now
      fn(...args)
    } else {
      lastArgs = args
      if (timeoutId === undefined) {
        const remaining = wait - (now - lastCallTime)
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now()
          timeoutId = undefined
          if (lastArgs) {
            fn(...lastArgs)
            lastArgs = undefined
          }
        }, remaining)
      }
    }
  }

  throttled.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
    lastArgs = undefined
    lastCallTime = undefined
  }

  return throttled as T & { cancel: () => void }
}

// --------------------------------------------------------
// merge — deep merge objects (source wins, arrays replaced wholesale).
// Only plain objects are recursed into; class instances and arrays
// are assigned by reference. Blocks prototype-pollution keys.
// --------------------------------------------------------
const isPlainObject = (value: unknown): value is Record<string, any> =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype

export const merge = <T extends Record<string, any>>(
  target: T,
  ...sources: Record<string, any>[]
): T => {
  for (const source of sources) {
    if (source == null) continue

    for (const key of Object.keys(source)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        continue

      const targetVal = (target as any)[key]
      const sourceVal = source[key]

      if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        ;(target as any)[key] = merge({ ...targetVal }, sourceVal)
      } else {
        ;(target as any)[key] = sourceVal
      }
    }
  }

  return target
}
