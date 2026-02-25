# @vitus-labs/hooks

28 React hooks for UI interactions, state management, DOM observation, accessibility, and theming. 2.15KB gzipped.

[![npm](https://img.shields.io/npm/v/@vitus-labs/hooks)](https://www.npmjs.com/package/@vitus-labs/hooks)
[![license](https://img.shields.io/npm/l/@vitus-labs/hooks)](https://github.com/vitus-labs/ui-system/blob/main/LICENSE)

## Installation

```bash
npm install @vitus-labs/hooks
```

## Hooks

### Primitives

#### useLatest

Returns a ref that always holds the latest value. Avoids stale closures in callbacks and effects.

```ts
const ref = useLatest(callback)
// ref.current is always the latest callback
```

#### useToggle

Boolean state with `toggle`, `setTrue`, and `setFalse` helpers.

```ts
const [isOpen, toggle, open, close] = useToggle(false)
```

#### usePrevious

Returns the value from the previous render.

```ts
const prev = usePrevious(count)
// undefined on first render, then the previous value
```

### Callbacks

#### useDebouncedCallback

Stable debounced function with `.cancel()` and `.flush()`.

```ts
const search = useDebouncedCallback((query: string) => {
  fetchResults(query)
}, 300)

search('hello') // fires after 300ms of inactivity
search.cancel()  // cancel pending
search.flush()   // fire immediately
```

#### useThrottledCallback

Stable throttled function with `.cancel()`. Uses `throttle` from `@vitus-labs/core`.

```ts
const handleScroll = useThrottledCallback(() => {
  updatePosition()
}, 100)
```

### State

#### useDebouncedValue

Returns a debounced version of the value that only updates after `delay` ms of inactivity.

```ts
const [search, setSearch] = useState('')
const debouncedSearch = useDebouncedValue(search, 300)
```

#### useControllableState

Unified controlled/uncontrolled state pattern.

```ts
const [value, setValue] = useControllableState({
  value: props.value,       // controlled (optional)
  defaultValue: '',         // uncontrolled fallback
  onChange: props.onChange,  // fires in both modes
})
```

### Effects

#### useUpdateEffect

Like `useEffect` but skips the initial mount.

```ts
useUpdateEffect(() => {
  // only fires on updates, not on mount
  saveToStorage(value)
}, [value])
```

#### useIsomorphicLayoutEffect

`useLayoutEffect` on the client, `useEffect` on the server. Avoids SSR warnings.

```ts
useIsomorphicLayoutEffect(() => {
  measureElement()
}, [])
```

#### useInterval

Declarative `setInterval` with auto-cleanup. Pass `null` to pause.

```ts
useInterval(() => tick(), 1000)     // every second
useInterval(() => tick(), null)      // paused
```

#### useTimeout

Declarative `setTimeout` with `reset` and `clear` controls.

```ts
const { reset, clear } = useTimeout(() => {
  showNotification()
}, 5000)
```

### DOM & Observers

#### useElementSize

Tracks element `width` and `height` via `ResizeObserver`.

```tsx
const [ref, { width, height }] = useElementSize()
return <div ref={ref}>Size: {width}x{height}</div>
```

#### useIntersection

`IntersectionObserver` wrapper for visibility detection.

```tsx
const [ref, entry] = useIntersection({ threshold: 0.5 })
const isVisible = entry?.isIntersecting
return <div ref={ref}>{isVisible ? 'Visible' : 'Hidden'}</div>
```

### Interaction

#### useHover

Tracks hover state with stable callback references.

```ts
const { hover, onMouseEnter, onMouseLeave } = useHover()
```

#### useFocus

Tracks focus state with stable callback references.

```ts
const { focused, onFocus, onBlur } = useFocus()
```

#### useClickOutside

Calls handler when a click occurs outside the referenced element.

```ts
const ref = useRef<HTMLDivElement>(null)
useClickOutside(ref, () => setOpen(false))
```

#### useScrollLock

Locks page scroll by setting `overflow: hidden` on `document.body`.

```ts
useScrollLock(isModalOpen)
```

#### useKeyboard

Listens for a specific keyboard key.

```ts
useKeyboard('Escape', () => setOpen(false))
```

#### useFocusTrap

Traps Tab/Shift+Tab focus within a container. Essential for modals and dialogs.

```ts
const ref = useRef<HTMLDivElement>(null)
useFocusTrap(ref, isOpen)
```

### Responsive

#### useMediaQuery

Subscribes to a CSS media query and returns whether it matches.

```ts
const isDesktop = useMediaQuery('(min-width: 1024px)')
```

#### useBreakpoint

Returns the currently active breakpoint name from the theme context.

```ts
const bp = useBreakpoint() // "xs" | "sm" | "md" | "lg" | "xl" | undefined
```

#### useColorScheme

Returns the user's preferred color scheme. Pairs with rocketstyle's `mode`.

```ts
const scheme = useColorScheme() // "light" | "dark"
```

#### useReducedMotion

Returns `true` when the user prefers reduced motion.

```ts
const reduced = useReducedMotion()
const duration = reduced ? 0 : 300
```

### Theme & Styling

#### useThemeValue

Deep-reads a value from the current theme by dot-separated path.

```ts
const primary = useThemeValue<string>('colors.primary')
const columns = useThemeValue<number>('grid.columns')
```

#### useRootSize

Returns `rootSize` from the theme with px/rem conversion utilities.

```ts
const { rootSize, pxToRem, remToPx } = useRootSize()
pxToRem(32) // "2rem"
remToPx(2)  // 32
```

#### useSpacing

Returns a spacing function based on the theme's root size.

```ts
const spacing = useSpacing()
spacing(1)   // "8px"
spacing(2)   // "16px"
spacing(0.5) // "4px"
```

### Composition

#### useMergedRef

Merges multiple refs (callback or object) into a single stable callback ref.

```tsx
const Component = forwardRef((props, ref) => {
  const localRef = useRef(null)
  const merged = useMergedRef(ref, localRef)
  return <div ref={merged} />
})
```

### Viewport

#### useWindowResize

Tracks viewport dimensions with throttled updates.

```ts
const { width, height } = useWindowResize({ throttleDelay: 300 })
```

## Peer Dependencies

| Package | Version |
| ------- | ------- |
| react | >= 19 |
| @vitus-labs/core | * |

## License

MIT
