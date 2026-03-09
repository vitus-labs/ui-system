import {
  useBreakpoint,
  useColorScheme,
  useControllableState,
  useDebouncedCallback,
  useDebouncedValue,
  useFocus,
  useHover,
  useInterval,
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
} from '@vitus-labs/hooks'
import { useRef, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

// ─── Helpers ────────────────────────────────────────────────────────────
const Card = ({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {note && <Text style={styles.note}>{note}</Text>}
    <View style={styles.cardBody}>{children}</View>
  </View>
)

const Btn = ({
  label,
  onPress,
  color = '#0070f3',
}: {
  label: string
  onPress: () => void
  color?: string
}) => (
  <Pressable
    style={[styles.btn, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.btnText}>{label}</Text>
  </Pressable>
)

const Val = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.val}>{String(children)}</Text>
)

// ═══════════════════════════════════════════════════════════════════════
// 1. useToggle
// ═══════════════════════════════════════════════════════════════════════
function ToggleDemo() {
  const [on, toggle] = useToggle(false)
  return (
    <Card title="useToggle" note="Simple boolean toggle">
      <View style={styles.row}>
        <Val>{on ? 'ON' : 'OFF'}</Val>
        <Btn label="Toggle" onPress={toggle} color={on ? '#e74c3c' : '#2ecc71'} />
      </View>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 2. useControllableState
// ═══════════════════════════════════════════════════════════════════════
function ControllableStateDemo() {
  const [value, setValue] = useControllableState({
    defaultValue: 0,
  })
  return (
    <Card title="useControllableState" note="Controlled / uncontrolled state pattern">
      <View style={styles.row}>
        <Val>{value}</Val>
        <Btn label="−" onPress={() => setValue((v) => v - 1)} color="#e74c3c" />
        <Btn label="+" onPress={() => setValue((v) => v + 1)} color="#2ecc71" />
        <Btn label="Reset" onPress={() => setValue(0)} />
      </View>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 3. usePrevious
// ═══════════════════════════════════════════════════════════════════════
function PreviousDemo() {
  const [count, setCount] = useState(0)
  const prev = usePrevious(count)
  return (
    <Card title="usePrevious" note="Tracks the previous render's value">
      <Text style={styles.detail}>
        Current: {count} · Previous: {prev ?? 'none'}
      </Text>
      <Btn label="Increment" onPress={() => setCount((c) => c + 1)} />
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 4. useDebouncedValue
// ═══════════════════════════════════════════════════════════════════════
function DebouncedValueDemo() {
  const [text, setText] = useState('')
  const debounced = useDebouncedValue(text, 500)
  return (
    <Card title="useDebouncedValue" note="Value updates after 500ms of inactivity">
      <TextInput
        style={styles.input}
        placeholder="Type something…"
        value={text}
        onChangeText={setText}
      />
      <Text style={styles.detail}>
        Debounced: "{debounced}"
      </Text>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 5. useDebouncedCallback
// ═══════════════════════════════════════════════════════════════════════
function DebouncedCallbackDemo() {
  const [count, setCount] = useState(0)
  const [raw, setRaw] = useState(0)
  const debounced = useDebouncedCallback(() => {
    setCount((c) => c + 1)
  }, 400)

  return (
    <Card title="useDebouncedCallback" note="Callback fires after 400ms pause">
      <Text style={styles.detail}>
        Taps: {raw} · Debounced fires: {count}
      </Text>
      <View style={styles.row}>
        <Btn
          label="Tap rapidly"
          onPress={() => {
            setRaw((r) => r + 1)
            debounced()
          }}
        />
        <Btn label="Cancel" onPress={debounced.cancel} color="#e74c3c" />
        <Btn label="Flush" onPress={debounced.flush} color="#f39c12" />
      </View>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 6. useThrottledCallback
// ═══════════════════════════════════════════════════════════════════════
function ThrottledCallbackDemo() {
  const [count, setCount] = useState(0)
  const [raw, setRaw] = useState(0)
  const throttled = useThrottledCallback(() => {
    setCount((c) => c + 1)
  }, 1000)

  return (
    <Card title="useThrottledCallback" note="At most 1 call per 1000ms">
      <Text style={styles.detail}>
        Taps: {raw} · Throttled fires: {count}
      </Text>
      <View style={styles.row}>
        <Btn
          label="Tap rapidly"
          onPress={() => {
            setRaw((r) => r + 1)
            throttled()
          }}
        />
        <Btn label="Cancel" onPress={throttled.cancel} color="#e74c3c" />
      </View>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 7. useInterval
// ═══════════════════════════════════════════════════════════════════════
function IntervalDemo() {
  const [count, setCount] = useState(0)
  const [running, toggleRunning] = useToggle(true)

  useInterval(() => setCount((c) => c + 1), running ? 1000 : null)

  return (
    <Card title="useInterval" note="Declarative setInterval, pass null to pause">
      <View style={styles.row}>
        <Val>{count}</Val>
        <Btn
          label={running ? 'Pause' : 'Resume'}
          onPress={toggleRunning}
          color={running ? '#e74c3c' : '#2ecc71'}
        />
        <Btn label="Reset" onPress={() => setCount(0)} />
      </View>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 8. useTimeout
// ═══════════════════════════════════════════════════════════════════════
function TimeoutDemo() {
  const [fired, setFired] = useState(false)
  const { reset, clear } = useTimeout(() => setFired(true), fired ? null : 3000)

  return (
    <Card title="useTimeout" note="Fires after 3s, with reset/clear">
      <Text style={styles.detail}>
        {fired ? 'Timeout fired!' : 'Waiting 3s…'}
      </Text>
      <View style={styles.row}>
        <Btn
          label="Reset"
          onPress={() => {
            setFired(false)
            reset()
          }}
          color="#2ecc71"
        />
        <Btn label="Clear" onPress={clear} color="#e74c3c" />
      </View>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 9. useLatest
// ═══════════════════════════════════════════════════════════════════════
function LatestDemo() {
  const [count, setCount] = useState(0)
  const latestRef = useLatest(count)
  const [snapshot, setSnapshot] = useState<number | null>(null)

  return (
    <Card title="useLatest" note="Ref always holds the latest value (no stale closures)">
      <Text style={styles.detail}>
        Count: {count} · Snapshot from ref: {snapshot ?? 'none'}
      </Text>
      <View style={styles.row}>
        <Btn label="+1" onPress={() => setCount((c) => c + 1)} />
        <Btn
          label="Read ref"
          onPress={() => setSnapshot(latestRef.current)}
          color="#9b59b6"
        />
      </View>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 10. useUpdateEffect
// ═══════════════════════════════════════════════════════════════════════
function UpdateEffectDemo() {
  const [count, setCount] = useState(0)
  const [updates, setUpdates] = useState(0)

  useUpdateEffect(() => {
    setUpdates((u) => u + 1)
  }, [count])

  return (
    <Card title="useUpdateEffect" note="Like useEffect but skips the initial mount">
      <Text style={styles.detail}>
        Count: {count} · Update effects fired: {updates}
      </Text>
      <Btn label="Increment" onPress={() => setCount((c) => c + 1)} />
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 11. useFocus
// ═══════════════════════════════════════════════════════════════════════
function FocusDemo() {
  const { focused, onFocus, onBlur } = useFocus()
  return (
    <Card title="useFocus" note="Tracks focus state with onFocus/onBlur handlers">
      <Text style={styles.detail}>
        Focused: {focused ? 'yes' : 'no'}
      </Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        placeholder="Tap to focus…"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 12. useHover
// ═══════════════════════════════════════════════════════════════════════
function HoverDemo() {
  const { hover, onMouseEnter, onMouseLeave } = useHover()
  return (
    <Card title="useHover" note="No-op on native (mouse events are web-only)">
      <Text style={styles.detail}>
        Hover: {hover ? 'yes' : 'no'}
      </Text>
      <View
        style={[styles.hoverBox, hover && styles.hoverBoxActive]}
        // @ts-expect-error RN web supports mouse events
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Text style={styles.hoverText}>Hover me (web only)</Text>
      </View>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 13. useMergedRef
// ═══════════════════════════════════════════════════════════════════════
function MergedRefDemo() {
  const ref1 = useRef<View>(null)
  const ref2 = useRef<View>(null)
  const mergedRef = useMergedRef(ref1, ref2)
  const [measured, setMeasured] = useState(false)

  return (
    <Card title="useMergedRef" note="Merges multiple refs into one callback ref">
      <View ref={mergedRef} style={styles.measuredBox}>
        <Text style={styles.detail}>
          Both refs point here. ref1 === ref2: {String(ref1.current === ref2.current)}
        </Text>
      </View>
      <Btn
        label="Check refs"
        onPress={() => setMeasured(ref1.current != null && ref2.current != null)}
      />
      <Text style={styles.detail}>Both refs assigned: {String(measured)}</Text>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 14. useBreakpoint
// ═══════════════════════════════════════════════════════════════════════
function BreakpointDemo() {
  const breakpoint = useBreakpoint()
  return (
    <Card title="useBreakpoint" note="Current breakpoint from theme context">
      <Val>{breakpoint ?? 'no breakpoints configured'}</Val>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 15. useColorScheme
// ═══════════════════════════════════════════════════════════════════════
function ColorSchemeDemo() {
  const scheme = useColorScheme()
  return (
    <Card title="useColorScheme" note="System light/dark mode">
      <Val>{scheme}</Val>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 16. useReducedMotion
// ═══════════════════════════════════════════════════════════════════════
function ReducedMotionDemo() {
  const reduced = useReducedMotion()
  return (
    <Card title="useReducedMotion" note="Accessibility: prefers-reduced-motion">
      <Val>{reduced ? 'Enabled' : 'Disabled'}</Val>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 17. useWindowResize
// ═══════════════════════════════════════════════════════════════════════
function WindowResizeDemo() {
  const { width, height } = useWindowResize()
  return (
    <Card title="useWindowResize" note="Window / screen dimensions">
      <Val>
        {width} × {height}
      </Val>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 18. useRootSize
// ═══════════════════════════════════════════════════════════════════════
function RootSizeDemo() {
  const { rootSize, pxToRem, remToPx } = useRootSize()
  return (
    <Card title="useRootSize" note="Root font size + px/rem conversions">
      <Text style={styles.detail}>rootSize: {rootSize}</Text>
      <Text style={styles.detail}>pxToRem(32): {pxToRem(32)}</Text>
      <Text style={styles.detail}>remToPx(2): {remToPx(2)}</Text>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 19. useSpacing
// ═══════════════════════════════════════════════════════════════════════
function SpacingDemo() {
  const spacing = useSpacing()
  return (
    <Card title="useSpacing" note="Spacing scale based on rootSize / 2">
      <Text style={styles.detail}>spacing(1): {spacing(1)}</Text>
      <Text style={styles.detail}>spacing(2): {spacing(2)}</Text>
      <Text style={styles.detail}>spacing(4): {spacing(4)}</Text>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 20. useThemeValue
// ═══════════════════════════════════════════════════════════════════════
function ThemeValueDemo() {
  const rootSize = useThemeValue('rootSize')
  const breakpoints = useThemeValue('breakpoints')
  return (
    <Card title="useThemeValue" note="Deep-read from theme by path">
      <Text style={styles.detail}>rootSize: {String(rootSize)}</Text>
      <Text style={styles.detail}>
        breakpoints: {JSON.stringify(breakpoints)}
      </Text>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Screen
// ═══════════════════════════════════════════════════════════════════════
export default function HooksScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hooks (React Native)</Text>
      <Text style={styles.subtitle}>
        All 20 RN-compatible hooks from @vitus-labs/hooks
      </Text>

      <Text style={styles.section}>State & Lifecycle</Text>
      <ToggleDemo />
      <ControllableStateDemo />
      <PreviousDemo />
      <UpdateEffectDemo />
      <LatestDemo />

      <Text style={styles.section}>Debounce & Throttle</Text>
      <DebouncedValueDemo />
      <DebouncedCallbackDemo />
      <ThrottledCallbackDemo />

      <Text style={styles.section}>Timers</Text>
      <IntervalDemo />
      <TimeoutDemo />

      <Text style={styles.section}>Input & Interaction</Text>
      <FocusDemo />
      <HoverDemo />
      <MergedRefDemo />

      <Text style={styles.section}>Theme & Layout</Text>
      <BreakpointDemo />
      <ColorSchemeDemo />
      <ReducedMotionDemo />
      <WindowResizeDemo />
      <RootSizeDemo />
      <SpacingDemo />
      <ThemeValueDemo />

      <View style={styles.spacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  section: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 12,
    color: '#111',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 2 },
  cardBody: { marginTop: 8 },
  note: { fontSize: 12, color: '#888' },
  detail: { fontSize: 14, color: '#555', marginBottom: 4 },
  val: { fontSize: 20, fontWeight: '700', color: '#333' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  inputFocused: { borderColor: '#0070f3', borderWidth: 2 },
  hoverBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  hoverBoxActive: { backgroundColor: '#d0e8ff' },
  hoverText: { fontSize: 14, color: '#555' },
  measuredBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    marginBottom: 8,
  },
  spacer: { height: 60 },
})
