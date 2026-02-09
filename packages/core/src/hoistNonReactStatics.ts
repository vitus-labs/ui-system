import { isMemo } from 'react-is'

const REACT_STATICS: Record<string, true> = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true,
}

const KNOWN_STATICS: Record<string, true> = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true,
}

const FORWARD_REF_STATICS: Record<string, true> = {
  $$typeof: true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
}

const MEMO_STATICS: Record<string, true> = {
  $$typeof: true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true,
}

const TYPE_STATICS: Record<string | symbol, Record<string, true>> = {}

// Symbol.for matches what react-is uses internally
TYPE_STATICS[Symbol.for('react.forward_ref')] = FORWARD_REF_STATICS
TYPE_STATICS[Symbol.for('react.memo')] = MEMO_STATICS

const getStatics = (component: any): Record<string, true> => {
  if (isMemo(component)) return MEMO_STATICS
  return TYPE_STATICS[component.$$typeof] || REACT_STATICS
}

const hoistNonReactStatics = <T, S>(
  target: T,
  source: S,
  excludeList?: Record<string, true>,
): T => {
  if (typeof source === 'string') return target

  const proto = Object.getPrototypeOf(source)
  if (proto && proto !== Object.prototype) {
    hoistNonReactStatics(target, proto, excludeList)
  }

  const keys: (string | symbol)[] = [
    ...Object.getOwnPropertyNames(source),
    ...Object.getOwnPropertySymbols(source),
  ]

  const targetStatics = getStatics(target)
  const sourceStatics = getStatics(source)

  for (const key of keys) {
    const k = key as string
    if (
      KNOWN_STATICS[k] ||
      excludeList?.[k] ||
      sourceStatics[k] ||
      targetStatics[k]
    ) {
      continue
    }

    const descriptor = Object.getOwnPropertyDescriptor(source, key)
    if (descriptor) {
      try {
        Object.defineProperty(target, key, descriptor)
      } catch {
        // Silently skip non-configurable properties
      }
    }
  }

  return target
}

export default hoistNonReactStatics
