import type { UseBreakpoint } from './useBreakpoint'
import useBreakpoint from './useBreakpoint'
import type { UseColorScheme } from './useColorScheme'
import useColorScheme from './useColorScheme'
import type { UseControllableState } from './useControllableState'
import useControllableState from './useControllableState'
import type { UseDebouncedCallback } from './useDebouncedCallback'
import useDebouncedCallback from './useDebouncedCallback'
import type { UseDebouncedValue } from './useDebouncedValue'
import useDebouncedValue from './useDebouncedValue'
// useFocus + useHover are intentionally NOT re-exported on native — they
// return onMouseEnter/onMouseLeave/onFocus/onBlur handler names that no
// React Native component fires. Exporting them would have consumers wire
// `<Pressable {...useHover()} />` and silently get a permanently-false
// `hover` state with no warning. If you need hover/focus on RN, use
// Pressable's `onHoverIn`/`onHoverOut` / TextInput's `onFocus`/`onBlur`
// directly — they're per-component, not generalizable to a single hook.
import type { UseInterval } from './useInterval'
import useInterval from './useInterval'
import type { UseIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'
import type { UseKeyboard } from './useKeyboard'
import useKeyboard from './useKeyboard'
import type { UseLatest } from './useLatest'
import useLatest from './useLatest'
import type { UseMergedRef } from './useMergedRef'
import useMergedRef from './useMergedRef'
import type { UsePrevious } from './usePrevious'
import usePrevious from './usePrevious'
import type { UseReducedMotion } from './useReducedMotion'
import useReducedMotion from './useReducedMotion'
import type { UseRootSize } from './useRootSize'
import useRootSize from './useRootSize'
import type { UseSpacing } from './useSpacing'
import useSpacing from './useSpacing'
import type { UseThemeValue } from './useThemeValue'
import useThemeValue from './useThemeValue'
import type { UseThrottledCallback } from './useThrottledCallback'
import useThrottledCallback from './useThrottledCallback'
import type { UseTimeout } from './useTimeout'
import useTimeout from './useTimeout'
import type { UseToggle } from './useToggle'
import useToggle from './useToggle'
import type { UseUpdateEffect } from './useUpdateEffect'
import useUpdateEffect from './useUpdateEffect'
import type { UseWindowResize } from './useWindowResize'
import useWindowResize from './useWindowResize'

export type {
  UseBreakpoint,
  UseColorScheme,
  UseControllableState,
  UseDebouncedCallback,
  UseDebouncedValue,
  UseInterval,
  UseIsomorphicLayoutEffect,
  UseKeyboard,
  UseLatest,
  UseMergedRef,
  UsePrevious,
  UseReducedMotion,
  UseRootSize,
  UseSpacing,
  UseThemeValue,
  UseThrottledCallback,
  UseTimeout,
  UseToggle,
  UseUpdateEffect,
  UseWindowResize,
}

export {
  useBreakpoint,
  useColorScheme,
  useControllableState,
  useDebouncedCallback,
  useDebouncedValue,
  useInterval,
  useIsomorphicLayoutEffect,
  useKeyboard,
  useLatest,
  useMergedRef,
  usePrevious,
  useReducedMotion,
  useRootSize,
  useSpacing,
  useThemeValue,
  useThrottledCallback,
  useTimeout,
  useToggle,
  useUpdateEffect,
  useWindowResize,
}
