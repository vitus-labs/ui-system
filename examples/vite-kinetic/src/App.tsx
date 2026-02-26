import {
  compose,
  createBlur,
  createFade,
  createRotate,
  createScale,
  createSlide,
  presets,
  reverse,
  withDelay,
  withDuration,
  withEasing,
} from '@vitus-labs/kinetic-presets'
import {
  fade,
  kinetic,
  scaleIn,
  slideDown,
  slideLeft,
  slideRight,
  slideUp,
} from '@vitus-labs/kinetic'
import { useCallback, useRef, useState } from 'react'
import { highlight } from 'sugar-high'

// ─── Shared styles ─────────────────────────────────────────────────────────

const wrapper: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '32px 24px',
}

const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 999,
  background: '#e8f4fd',
  color: '#0070f3',
  fontSize: '0.75rem',
  fontWeight: 600,
  marginBottom: 8,
}

const sectionTitle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  margin: '40px 0 16px',
  paddingTop: 16,
  borderTop: '1px solid #e9ecef',
}

const card: React.CSSProperties = {
  padding: 24,
  borderRadius: 12,
  background: '#f8f9fa',
  border: '1px solid #e9ecef',
  marginBottom: 24,
}

const cardTitle: React.CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 600,
  margin: '0 0 8px',
}

const cardDesc: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#555',
  lineHeight: 1.6,
  margin: '0 0 16px',
}

const btn: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 6,
  border: '1px solid #dee2e6',
  background: '#fff',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
  transition: 'all 0.15s',
}

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: '#0070f3',
  color: '#fff',
  border: '1px solid #0070f3',
}

const btnSmall: React.CSSProperties = {
  ...btn,
  padding: '4px 12px',
  fontSize: 13,
}

const btnRow: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  marginBottom: 16,
}

const colorBox = (bg: string): React.CSSProperties => ({
  padding: '16px 24px',
  borderRadius: 8,
  background: bg,
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
  textAlign: 'center',
})

const logBox: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 6,
  background: '#1a1a2e',
  color: '#a8e6cf',
  fontFamily: 'monospace',
  fontSize: 12,
  lineHeight: 1.8,
  maxHeight: 120,
  overflowY: 'auto',
}

const gridRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: 12,
}

const listItem: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 8,
  background: '#fff',
  border: '1px solid #e9ecef',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
}

const accordionHeader: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 8,
  background: '#fff',
  border: '1px solid #e9ecef',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontWeight: 500,
  fontSize: 14,
  marginBottom: 4,
  width: '100%',
  font: 'inherit',
}

const accordionContent: React.CSSProperties = {
  padding: '16px',
  fontSize: 14,
  color: '#555',
  lineHeight: 1.6,
}

const codeBlockStyle: React.CSSProperties = {
  margin: '12px 0 0',
  padding: 16,
  borderRadius: 8,
  background: '#282c34',
  color: '#abb2bf',
  fontFamily:
    "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
  fontSize: 13,
  lineHeight: 1.7,
  overflowX: 'auto',
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={codeBlockStyle}>
      <code dangerouslySetInnerHTML={{ __html: highlight(children) }} />
    </pre>
  )
}

// ─── Pre-built kinetic components (defined at module level) ──────────────────

// Preset-based components
const FadeDiv = kinetic('div').preset(fade)
const ScaleInDiv = kinetic('div').preset(scaleIn)
const SlideUpDiv = kinetic('div').preset(slideUp)
const SlideDownDiv = kinetic('div').preset(slideDown)
const SlideLeftDiv = kinetic('div').preset(slideLeft)
const SlideRightDiv = kinetic('div').preset(slideRight)

// Custom spring animation using chained enter/leave
const SpringPanel = kinetic('div')
  .enter({ opacity: 0, transform: 'scale(0.9) translateY(10px)' })
  .enterTo({ opacity: 1, transform: 'scale(1) translateY(0)' })
  .enterTransition('all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)')
  .leave({ opacity: 1, transform: 'scale(1) translateY(0)' })
  .leaveTo({ opacity: 0, transform: 'scale(0.9) translateY(10px)' })
  .leaveTransition('all 250ms ease-in')

// Class-based transition
const ClassFadeDiv = kinetic('div')
  .enterClass({ active: 't-enter', from: 't-enter-from', to: 't-enter-to' })
  .leaveClass({ active: 't-leave', from: 't-leave-from', to: 't-leave-to' })

// Fade backdrop (for modal overlay)
const Backdrop = kinetic('button')
  .enter({ opacity: 0 })
  .enterTo({ opacity: 1 })
  .enterTransition('opacity 300ms ease-out')
  .leave({ opacity: 1 })
  .leaveTo({ opacity: 0 })
  .leaveTransition('opacity 200ms ease-in')

// Modal dialog with spring animation
const Dialog = kinetic('div')
  .enter({ opacity: 0, transform: 'scale(0.9) translateY(20px)' })
  .enterTo({ opacity: 1, transform: 'scale(1) translateY(0)' })
  .enterTransition('all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)')
  .leave({ opacity: 1, transform: 'scale(1) translateY(0)' })
  .leaveTo({ opacity: 0, transform: 'scale(0.95) translateY(10px)' })
  .leaveTransition('all 200ms ease-in')

// Collapse components
const AccordionCollapse = kinetic('div').collapse({
  transition: 'height 300ms ease',
})
const BouncyCollapse = kinetic('section').collapse({
  transition: 'height 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
})

// Stagger components
const StaggerMenu = kinetic('div').preset(slideUp).stagger({ interval: 75 })
const StaggerNotifications = kinetic('div')
  .enter({ opacity: 0, transform: 'translateX(24px)' })
  .enterTo({ opacity: 1, transform: 'translateX(0)' })
  .enterTransition('opacity 300ms ease-out, transform 300ms ease-out')
  .leave({ opacity: 1, transform: 'translateX(0)' })
  .leaveTo({ opacity: 0, transform: 'translateX(-24px)' })
  .leaveTransition('opacity 200ms ease-in, transform 200ms ease-in')
  .stagger({ interval: 100, reverseLeave: true })
const StaggerCardGrid = kinetic('div').preset(scaleIn).stagger({ interval: 60 })

// Group components (key-based enter/exit)
const GroupList = kinetic('div')
  .enter({ opacity: 0, transform: 'translateX(-16px)' })
  .enterTo({ opacity: 1, transform: 'translateX(0)' })
  .enterTransition('opacity 300ms ease-out, transform 300ms ease-out')
  .leave({ opacity: 1, transform: 'translateX(0)' })
  .leaveTo({ opacity: 0, transform: 'translateX(16px)' })
  .leaveTransition('opacity 200ms ease-in, transform 200ms ease-in')
  .group()
const ToastGroup = kinetic('div')
  .enter({ opacity: 0, transform: 'translateY(-8px) scale(0.98)' })
  .enterTo({ opacity: 1, transform: 'translateY(0) scale(1)' })
  .enterTransition('all 300ms ease-out')
  .leave({ opacity: 1, transform: 'translateX(0)' })
  .leaveTo({ opacity: 0, transform: 'translateX(100px)' })
  .leaveTransition('all 250ms ease-in')
  .group()

// ─── Kinetic Presets: module-level kinetic components ─────────────────────────

// Create kinetic('div') for every preset in the library (122 total)
const presetComponents = Object.fromEntries(
  Object.entries(presets).map(([name, preset]) => [
    name,
    kinetic('div').preset(preset),
  ]),
) as Record<string, typeof FadeDiv>

// Factory-created components
const FactoryFadeUp = kinetic('div').preset(
  createFade({ direction: 'up', distance: 24, duration: 400 }),
)
const FactorySlideRight = kinetic('div').preset(
  createSlide({ direction: 'right', distance: 32, duration: 350 }),
)
const FactoryScaleSpring = kinetic('div').preset(
  createScale({
    from: 0.5,
    duration: 500,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  }),
)
const FactoryRotate = kinetic('div').preset(
  createRotate({ degrees: 30, duration: 400 }),
)
const FactoryBlurScale = kinetic('div').preset(
  createBlur({ amount: 12, scale: 0.9, duration: 400 }),
)

// Composition utility components
const ComposedFadeSlide = kinetic('div').preset(
  compose(presets.fade, presets.slideUp),
)
const SlowFade = kinetic('div').preset(withDuration(presets.fade, 800, 500))
const SpringEased = kinetic('div').preset(
  withEasing(presets.scaleIn, 'cubic-bezier(0.34, 1.56, 0.64, 1)'),
)
const DelayedFade = kinetic('div').preset(withDelay(presets.fadeUp, 200, 0))
const ReversedSlide = kinetic('div').preset(reverse(presets.slideUp))

// Preset categories for the gallery
const PRESET_CATEGORIES = [
  {
    name: 'Fades',
    color: '#0070f3',
    items: [
      'fade',
      'fadeUp',
      'fadeDown',
      'fadeLeft',
      'fadeRight',
      'fadeUpBig',
      'fadeDownBig',
      'fadeLeftBig',
      'fadeRightBig',
      'fadeScale',
      'fadeUpLeft',
      'fadeUpRight',
      'fadeDownLeft',
      'fadeDownRight',
    ],
  },
  {
    name: 'Slides',
    color: '#059669',
    items: [
      'slideUp',
      'slideDown',
      'slideLeft',
      'slideRight',
      'slideUpBig',
      'slideDownBig',
      'slideLeftBig',
      'slideRightBig',
    ],
  },
  {
    name: 'Scales',
    color: '#7c3aed',
    items: [
      'scaleIn',
      'scaleOut',
      'scaleUp',
      'scaleDown',
      'scaleInUp',
      'scaleInDown',
      'scaleInLeft',
      'scaleInRight',
    ],
  },
  {
    name: 'Zooms',
    color: '#d97706',
    items: [
      'zoomIn',
      'zoomOut',
      'zoomInUp',
      'zoomInDown',
      'zoomInLeft',
      'zoomInRight',
      'zoomOutUp',
      'zoomOutDown',
      'zoomOutLeft',
      'zoomOutRight',
    ],
  },
  {
    name: 'Flips',
    color: '#dc2626',
    items: [
      'flipX',
      'flipY',
      'flipXReverse',
      'flipYReverse',
      'flipDiagonal',
      'flipDiagonalReverse',
    ],
  },
  {
    name: 'Rotations',
    color: '#2563eb',
    items: [
      'rotateIn',
      'rotateInReverse',
      'rotateInUp',
      'rotateInDown',
      'spinIn',
      'spinInReverse',
      'scaleRotateIn',
      'newspaperIn',
    ],
  },
  {
    name: 'Bounce / Spring / Pop',
    color: '#e11d48',
    items: [
      'bounceIn',
      'bounceInUp',
      'bounceInDown',
      'bounceInLeft',
      'bounceInRight',
      'springIn',
      'popIn',
      'rubberIn',
      'squishX',
      'squishY',
    ],
  },
  {
    name: 'Blur',
    color: '#6366f1',
    items: [
      'blurIn',
      'blurInUp',
      'blurInDown',
      'blurInLeft',
      'blurInRight',
      'blurScale',
    ],
  },
  {
    name: 'Puff',
    color: '#8b5cf6',
    items: ['puffIn', 'puffOut'],
  },
  {
    name: 'Clip Path',
    color: '#0891b2',
    items: [
      'clipTop',
      'clipBottom',
      'clipLeft',
      'clipRight',
      'clipCircle',
      'clipCenter',
      'clipDiamond',
      'clipCorner',
    ],
  },
  {
    name: 'Perspective / 3D',
    color: '#a855f7',
    items: [
      'perspectiveUp',
      'perspectiveDown',
      'perspectiveLeft',
      'perspectiveRight',
    ],
  },
  {
    name: 'Tilt',
    color: '#9333ea',
    items: ['tiltInUp', 'tiltInDown', 'tiltInLeft', 'tiltInRight'],
  },
  {
    name: 'Swing',
    color: '#c026d3',
    items: ['swingInTop', 'swingInBottom', 'swingInLeft', 'swingInRight'],
  },
  {
    name: 'Slit',
    color: '#7e22ce',
    items: ['slitHorizontal', 'slitVertical'],
  },
  {
    name: 'Swirl',
    color: '#db2777',
    items: ['swirlIn', 'swirlInReverse'],
  },
  {
    name: 'Back',
    color: '#0d9488',
    items: ['backInUp', 'backInDown', 'backInLeft', 'backInRight'],
  },
  {
    name: 'Light Speed',
    color: '#f59e0b',
    items: ['lightSpeedInLeft', 'lightSpeedInRight'],
  },
  {
    name: 'Roll',
    color: '#ef4444',
    items: ['rollInLeft', 'rollInRight'],
  },
  {
    name: 'Fly',
    color: '#3b82f6',
    items: ['flyInUp', 'flyInDown', 'flyInLeft', 'flyInRight'],
  },
  {
    name: 'Float',
    color: '#14b8a6',
    items: ['floatUp', 'floatDown', 'floatLeft', 'floatRight'],
  },
  {
    name: 'Push',
    color: '#f97316',
    items: ['pushInLeft', 'pushInRight'],
  },
  {
    name: 'Expand',
    color: '#ea580c',
    items: ['expandX', 'expandY'],
  },
  {
    name: 'Skew',
    color: '#65a30d',
    items: ['skewIn', 'skewInReverse', 'skewInY', 'skewInYReverse'],
  },
  {
    name: 'Drop / Rise',
    color: '#be185d',
    items: ['drop', 'rise'],
  },
]

// ─── 1. Preset Showcase ─────────────────────────────────────────────────────

function PresetShowcase() {
  const [active, setActive] = useState<string | null>(null)

  const presetEntries = [
    { name: 'fade', Comp: FadeDiv, color: '#0070f3' },
    { name: 'scaleIn', Comp: ScaleInDiv, color: '#7c3aed' },
    { name: 'slideUp', Comp: SlideUpDiv, color: '#059669' },
    { name: 'slideDown', Comp: SlideDownDiv, color: '#d97706' },
    { name: 'slideLeft', Comp: SlideLeftDiv, color: '#dc2626' },
    { name: 'slideRight', Comp: SlideRightDiv, color: '#2563eb' },
  ]

  return (
    <div style={card}>
      <h3 style={cardTitle}>Built-in Presets</h3>
      <p style={cardDesc}>
        Six ready-made style-object presets. Each creates a reusable component
        via <code>kinetic('div').preset(fade)</code>.
      </p>
      <div style={gridRow}>
        {presetEntries.map(({ name, Comp, color }) => (
          <div key={name}>
            <button
              type="button"
              style={{
                ...btn,
                width: '100%',
                marginBottom: 8,
                background: active === name ? color : '#fff',
                color: active === name ? '#fff' : '#333',
                borderColor: color,
              }}
              onClick={() => setActive(active === name ? null : name)}
            >
              {name}
            </button>
            <Comp show={active === name} style={colorBox(color)}>
              {name}
            </Comp>
          </div>
        ))}
      </div>
      <CodeBlock>{`const FadeDiv = kinetic('div').preset(fade)

<FadeDiv show={isOpen} style={{ ... }}>
  Content
</FadeDiv>`}</CodeBlock>
    </div>
  )
}

// ─── 2. Style-Object Chaining API ───────────────────────────────────────────

function StyleObjectDemo() {
  const [show, setShow] = useState(false)

  return (
    <div style={card}>
      <h3 style={cardTitle}>Style-Object Chaining API</h3>
      <p style={cardDesc}>
        Chain <code>.enter()</code>, <code>.enterTo()</code>,{' '}
        <code>.enterTransition()</code> and their leave counterparts. Each
        method returns a new immutable component.
      </p>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setShow((s) => !s)}
      >
        {show ? 'Hide' : 'Show'} Panel
      </button>
      <div
        style={{
          marginTop: 16,
          position: 'relative',
          minHeight: show ? 120 : 0,
        }}
      >
        <SpringPanel
          show={show}
          style={{
            padding: 24,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
            Custom Spring-like Animation
          </div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>
            Using cubic-bezier for overshoot effect
          </div>
        </SpringPanel>
      </div>
      <CodeBlock>{`const SpringPanel = kinetic('div')
  .enter({ opacity: 0, transform: 'scale(0.9) translateY(10px)' })
  .enterTo({ opacity: 1, transform: 'scale(1) translateY(0)' })
  .enterTransition('all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)')
  .leave({ opacity: 1, transform: 'scale(1) translateY(0)' })
  .leaveTo({ opacity: 0, transform: 'scale(0.9) translateY(10px)' })
  .leaveTransition('all 250ms ease-in')

<SpringPanel show={show} style={{ ... }}>
  Content
</SpringPanel>`}</CodeBlock>
    </div>
  )
}

// ─── 3. Class-Based API ─────────────────────────────────────────────────────

function ClassBasedDemo() {
  const [show, setShow] = useState(false)

  return (
    <div style={card}>
      <h3 style={cardTitle}>Class-Based API (Tailwind-style)</h3>
      <p style={cardDesc}>
        Use <code>.enterClass()</code> and <code>.leaveClass()</code> with CSS
        classes. Works with Tailwind, CSS modules, or any class-based styling.
      </p>
      <style>{`
        .t-enter { transition: opacity 300ms ease, transform 300ms ease; }
        .t-enter-from { opacity: 0; transform: rotate(-5deg) scale(0.95); }
        .t-enter-to { opacity: 1; transform: rotate(0) scale(1); }
        .t-leave { transition: opacity 200ms ease, transform 200ms ease; }
        .t-leave-from { opacity: 1; transform: rotate(0) scale(1); }
        .t-leave-to { opacity: 0; transform: rotate(5deg) scale(0.95); }
      `}</style>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setShow((s) => !s)}
      >
        {show ? 'Hide' : 'Show'}
      </button>
      <div style={{ marginTop: 16 }}>
        <ClassFadeDiv show={show} style={colorBox('#e11d48')}>
          Class-Based Transition
        </ClassFadeDiv>
      </div>
      <CodeBlock>{`const ClassFadeDiv = kinetic('div')
  .enterClass({ active: 't-enter', from: 't-enter-from', to: 't-enter-to' })
  .leaveClass({ active: 't-leave', from: 't-leave-from', to: 't-leave-to' })

<ClassFadeDiv show={show} style={{ ... }}>
  Content
</ClassFadeDiv>`}</CodeBlock>
    </div>
  )
}

// ─── 4. Appear on Mount ─────────────────────────────────────────────────────

function AppearDemo() {
  const [mounted, setMounted] = useState(false)

  // Component with appear configured via .config()
  const AppearScale = ScaleInDiv

  return (
    <div style={card}>
      <h3 style={cardTitle}>Appear on Mount</h3>
      <p style={cardDesc}>
        Pass <code>appear</code> as a prop to animate the element when it first
        renders. Can also be baked in via{' '}
        <code>.config({'{ appear: true }'})</code>.
      </p>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setMounted((m) => !m)}
      >
        {mounted ? 'Unmount' : 'Mount'} Component
      </button>
      <div style={{ marginTop: 16 }}>
        {mounted && (
          <AppearScale show appear style={colorBox('#7c3aed')}>
            I animated in on mount!
          </AppearScale>
        )}
      </div>
      <CodeBlock>{`const ScaleInDiv = kinetic('div').preset(scaleIn)

{mounted && (
  <ScaleInDiv show appear style={{ ... }}>
    I animated in on mount!
  </ScaleInDiv>
)}`}</CodeBlock>
    </div>
  )
}

// ─── 5. Unmount vs Display None ─────────────────────────────────────────────

function UnmountDemo() {
  const [show, setShow] = useState(true)

  return (
    <div style={card}>
      <h3 style={cardTitle}>unmount vs display:none</h3>
      <p style={cardDesc}>
        By default, hidden elements are unmounted. Pass{' '}
        <code>unmount=false</code> to keep them as <code>display:none</code>.
      </p>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setShow((s) => !s)}
      >
        Toggle ({show ? 'visible' : 'hidden'})
      </button>
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 8,
              color: '#555',
            }}
          >
            unmount=true (default)
          </div>
          <FadeDiv show={show} style={colorBox('#0070f3')}>
            Removed from DOM
          </FadeDiv>
        </div>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 8,
              color: '#555',
            }}
          >
            unmount=false
          </div>
          <FadeDiv show={show} unmount={false} style={colorBox('#059669')}>
            Hidden with display:none
          </FadeDiv>
        </div>
      </div>
      <CodeBlock>{`const FadeDiv = kinetic('div').preset(fade)

// Unmounts from DOM (default)
<FadeDiv show={show}>Removed from DOM</FadeDiv>

// Keeps in DOM with display:none
<FadeDiv show={show} unmount={false}>Hidden</FadeDiv>`}</CodeBlock>
    </div>
  )
}

// ─── 6. Lifecycle Callbacks (.on() chain method) ────────────────────────────

function LifecycleDemo() {
  const [show, setShow] = useState(false)
  const [logs, setLogs] = useState<{ id: number; text: string }[]>([])

  const logIdRef = useRef(0)
  const log = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    } as Intl.DateTimeFormatOptions)
    const id = logIdRef.current++
    setLogs((prev) => [{ id, text: `[${time}] ${msg}` }, ...prev].slice(0, 20))
  }, [])

  return (
    <div style={card}>
      <h3 style={cardTitle}>Lifecycle Callbacks</h3>
      <p style={cardDesc}>
        Four callbacks fire at each stage. Use <code>.on()</code> to bake them
        into the component, or pass as runtime props.
      </p>
      <div style={btnRow}>
        <button
          type="button"
          style={btnPrimary}
          onClick={() => setShow((s) => !s)}
        >
          {show ? 'Leave' : 'Enter'}
        </button>
        <button
          type="button"
          style={btn}
          onClick={() => {
            setLogs([])
            logIdRef.current = 0
          }}
        >
          Clear Log
        </button>
      </div>
      <SlideUpDiv
        show={show}
        onEnter={() => log('onEnter')}
        onAfterEnter={() => log('onAfterEnter')}
        onLeave={() => log('onLeave')}
        onAfterLeave={() => log('onAfterLeave')}
        style={colorBox('#0070f3')}
      >
        Watch the logs below
      </SlideUpDiv>
      <div style={logBox}>
        {logs.length === 0
          ? '// Click the button to see lifecycle events...'
          : logs.map((l) => <div key={l.id}>{l.text}</div>)}
      </div>
      <CodeBlock>{`// Runtime callbacks as props
<SlideUpDiv
  show={show}
  onEnter={() => log('onEnter')}
  onAfterEnter={() => log('onAfterEnter')}
  onLeave={() => log('onLeave')}
  onAfterLeave={() => log('onAfterLeave')}
>
  Content
</SlideUpDiv>

// Or bake them via .on()
const Animated = kinetic('div')
  .preset(slideUp)
  .on({ onEnter: () => log('enter'), onAfterLeave: () => log('done') })`}</CodeBlock>
    </div>
  )
}

// ─── 7. Chaining Immutability ───────────────────────────────────────────────

function ChainingDemo() {
  const [show, setShow] = useState(false)

  // Demonstrate that chaining creates NEW components — Base is unaffected
  const Base = kinetic('div').enter({ opacity: 0 }).enterTo({ opacity: 1 })
  const WithSlide = Base.enter({
    opacity: 0,
    transform: 'translateY(20px)',
  }).enterTo({ opacity: 1, transform: 'translateY(0)' })
  const WithScale = Base.enter({
    opacity: 0,
    transform: 'scale(0.8)',
  }).enterTo({ opacity: 1, transform: 'scale(1)' })

  return (
    <div style={card}>
      <h3 style={cardTitle}>Immutable Chaining</h3>
      <p style={cardDesc}>
        Each chain method returns a <strong>new</strong> component — the
        original is never mutated. Build variants by branching from a base.
      </p>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setShow((s) => !s)}
      >
        {show ? 'Hide' : 'Show'} All
      </button>
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: '#555',
            }}
          >
            Base (fade only)
          </div>
          <Base show={show} style={colorBox('#0070f3')}>
            Fade
          </Base>
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: '#555',
            }}
          >
            WithSlide
          </div>
          <WithSlide show={show} style={colorBox('#7c3aed')}>
            Slide
          </WithSlide>
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: '#555',
            }}
          >
            WithScale
          </div>
          <WithScale show={show} style={colorBox('#059669')}>
            Scale
          </WithScale>
        </div>
      </div>
      <CodeBlock>{`const Base = kinetic('div')
  .enter({ opacity: 0 })
  .enterTo({ opacity: 1 })

// Branch from Base — Base remains unchanged
const WithSlide = Base
  .enter({ opacity: 0, transform: 'translateY(20px)' })
  .enterTo({ opacity: 1, transform: 'translateY(0)' })

const WithScale = Base
  .enter({ opacity: 0, transform: 'scale(0.8)' })
  .enterTo({ opacity: 1, transform: 'scale(1)' })`}</CodeBlock>
    </div>
  )
}

// ─── 8. Custom Tags ─────────────────────────────────────────────────────────

function CustomTagDemo() {
  const [show, setShow] = useState(false)

  const AnimatedSection = kinetic('section').preset(fade)
  const AnimatedAside = kinetic('aside').preset(slideLeft)
  const AnimatedNav = kinetic('nav').preset(slideDown)

  return (
    <div style={card}>
      <h3 style={cardTitle}>Custom HTML Tags</h3>
      <p style={cardDesc}>
        <code>kinetic()</code> accepts any HTML tag or React component. The tag
        becomes the animated element — no extra wrapper.
      </p>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setShow((s) => !s)}
      >
        {show ? 'Hide' : 'Show'} All
      </button>
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <AnimatedNav
          show={show}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: '#1a1a2e',
            color: '#fff',
            fontSize: 14,
          }}
        >
          {'<nav>'} — slideDown
        </AnimatedNav>
        <AnimatedSection
          show={show}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: '#0070f3',
            color: '#fff',
            fontSize: 14,
          }}
        >
          {'<section>'} — fade
        </AnimatedSection>
        <AnimatedAside
          show={show}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: '#7c3aed',
            color: '#fff',
            fontSize: 14,
          }}
        >
          {'<aside>'} — slideLeft
        </AnimatedAside>
      </div>
      <CodeBlock>{`const AnimatedSection = kinetic('section').preset(fade)
const AnimatedAside = kinetic('aside').preset(slideLeft)
const AnimatedNav = kinetic('nav').preset(slideDown)

<AnimatedNav show={show}>...</AnimatedNav>
<AnimatedSection show={show}>...</AnimatedSection>
<AnimatedAside show={show}>...</AnimatedAside>`}</CodeBlock>
    </div>
  )
}

// ─── 9. Collapse (Accordion) ────────────────────────────────────────────────

function CollapseDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const items = [
    {
      title: 'What is @vitus-labs/kinetic?',
      content:
        'A CSS-first animation library for React. The kinetic() chaining API provides enter/exit transitions, staggered animations, height collapse, and list reconciliation — all in ~3KB gzipped with full accessibility support.',
    },
    {
      title: 'How does the chaining API work?',
      content:
        'kinetic(tag) returns a React component with chain methods attached. Each method (.enter(), .preset(), .collapse(), etc.) returns a new immutable component with merged config. The pattern is inspired by rocketstyle.',
    },
    {
      title: 'Does it support reduced motion?',
      content:
        'Yes! When the user has prefers-reduced-motion: reduce enabled, all animations are skipped instantly. Enter/exit still works, but without any visual animation.',
    },
    {
      title: 'Can I use it with Tailwind CSS?',
      content:
        'Absolutely. Use .enterClass() and .leaveClass() with your Tailwind utility classes. The class-based API is designed specifically for utility-class frameworks.',
    },
  ]

  return (
    <div style={card}>
      <h3 style={cardTitle}>Collapse (Accordion)</h3>
      <p style={cardDesc}>
        <code>kinetic('div').collapse()</code> creates a height-animating
        component. Measures <code>scrollHeight</code> and transitions to exact
        pixel values.
      </p>
      <div>
        {items.map((item, i) => (
          <div key={item.title} style={{ marginBottom: 4 }}>
            <button
              type="button"
              style={accordionHeader}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>{item.title}</span>
              <span
                style={{
                  transition: 'transform 200ms ease',
                  transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0)',
                  fontSize: 12,
                }}
              >
                &#9660;
              </span>
            </button>
            <AccordionCollapse show={openIndex === i}>
              <div style={accordionContent}>{item.content}</div>
            </AccordionCollapse>
          </div>
        ))}
      </div>
      <CodeBlock>{`const AccordionCollapse = kinetic('div').collapse({
  transition: 'height 300ms ease',
})

<AccordionCollapse show={isOpen}>
  <div>Collapsible content</div>
</AccordionCollapse>`}</CodeBlock>
    </div>
  )
}

// ─── 10. Collapse with Custom Easing ────────────────────────────────────────

function CollapseCustomDemo() {
  const [show, setShow] = useState(false)

  return (
    <div style={card}>
      <h3 style={cardTitle}>Collapse with Custom Easing</h3>
      <p style={cardDesc}>
        Use <code>.collapse({'{ transition }'})</code> with any CSS transition
        string for custom timing.
      </p>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setShow((s) => !s)}
      >
        {show ? 'Collapse' : 'Expand'}
      </button>
      <div style={{ marginTop: 12 }}>
        <BouncyCollapse show={show}>
          <div
            style={{
              padding: 24,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 8,
              color: '#fff',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Bouncy height animation
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>
              Using cubic-bezier(0.34, 1.56, 0.64, 1) for an overshooting spring
              effect. The {'<section>'} tag is the animated wrapper.
            </div>
          </div>
        </BouncyCollapse>
      </div>
      <CodeBlock>{`const BouncyCollapse = kinetic('section').collapse({
  transition: 'height 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
})

<BouncyCollapse show={show}>
  <div>Expandable content</div>
</BouncyCollapse>`}</CodeBlock>
    </div>
  )
}

// ─── 11. Nested Collapse ────────────────────────────────────────────────────

function NestedCollapseDemo() {
  const [sections, setSections] = useState<Record<string, boolean>>({})
  const toggle = (key: string) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div style={card}>
      <h3 style={cardTitle}>Nested Collapsible Sections</h3>
      <p style={cardDesc}>
        Collapse components can be nested. Each level animates independently.
      </p>
      <div>
        <button
          type="button"
          style={accordionHeader}
          onClick={() => toggle('api')}
        >
          <span>API Reference</span>
          <span
            style={{
              fontSize: 12,
              transform: sections.api ? 'rotate(180deg)' : '',
              transition: 'transform 200ms',
            }}
          >
            &#9660;
          </span>
        </button>
        <AccordionCollapse show={!!sections.api}>
          <div style={{ padding: '8px 0 8px 16px' }}>
            <button
              type="button"
              style={accordionHeader}
              onClick={() => toggle('chain')}
            >
              <span>Chain Methods</span>
              <span
                style={{
                  fontSize: 12,
                  transform: sections.chain ? 'rotate(180deg)' : '',
                  transition: 'transform 200ms',
                }}
              >
                &#9660;
              </span>
            </button>
            <AccordionCollapse show={!!sections.chain}>
              <div style={accordionContent}>
                .preset() .enter() .enterTo() .enterTransition() .leave()
                .leaveTo() .leaveTransition() .enterClass() .leaveClass()
                .config() .on() .collapse() .stagger() .group()
              </div>
            </AccordionCollapse>

            <button
              type="button"
              style={accordionHeader}
              onClick={() => toggle('modes')}
            >
              <span>Modes</span>
              <span
                style={{
                  fontSize: 12,
                  transform: sections.modes ? 'rotate(180deg)' : '',
                  transition: 'transform 200ms',
                }}
              >
                &#9660;
              </span>
            </button>
            <AccordionCollapse show={!!sections.modes}>
              <div style={accordionContent}>
                transition (default): single element enter/leave | collapse:
                height-based expand/collapse | stagger: staggered entrance for
                lists | group: key-based enter/exit like TransitionGroup
              </div>
            </AccordionCollapse>

            <button
              type="button"
              style={accordionHeader}
              onClick={() => toggle('hooks')}
            >
              <span>Hooks</span>
              <span
                style={{
                  fontSize: 12,
                  transform: sections.hooks ? 'rotate(180deg)' : '',
                  transition: 'transform 200ms',
                }}
              >
                &#9660;
              </span>
            </button>
            <AccordionCollapse show={!!sections.hooks}>
              <div style={accordionContent}>
                useTransitionState: low-level state machine (idle → entering →
                entered → leaving → exited) | useAnimationEnd:
                transitionend/animationend detection with timeout fallback
              </div>
            </AccordionCollapse>
          </div>
        </AccordionCollapse>
      </div>
    </div>
  )
}

// ─── 12. Group (List Animations) ────────────────────────────────────────────

let nextId = 4

function GroupDemo() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1', color: '#0070f3' },
    { id: 2, text: 'Item 2', color: '#7c3aed' },
    { id: 3, text: 'Item 3', color: '#059669' },
  ])

  const colors = [
    '#0070f3',
    '#7c3aed',
    '#059669',
    '#d97706',
    '#dc2626',
    '#2563eb',
  ]

  const addItem = () => {
    const id = nextId++
    setItems((prev) => [
      ...prev,
      {
        id,
        text: `Item ${id}`,
        color: colors[id % colors.length],
      },
    ])
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const shuffle = () => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5))
  }

  return (
    <div style={card}>
      <h3 style={cardTitle}>Group Mode (List Animations)</h3>
      <p style={cardDesc}>
        <code>.group()</code> tracks children by key — new items animate in,
        removed items animate out. No <code>show</code> prop needed.
      </p>
      <div style={btnRow}>
        <button type="button" style={btnPrimary} onClick={addItem}>
          Add Item
        </button>
        <button type="button" style={btn} onClick={shuffle}>
          Shuffle
        </button>
        <button
          type="button"
          style={{ ...btn, color: '#dc2626', borderColor: '#dc2626' }}
          onClick={() => setItems([])}
        >
          Remove All
        </button>
      </div>
      <GroupList>
        {items.map((item) => (
          <div key={item.id} style={listItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: item.color,
                }}
              />
              <span style={{ fontWeight: 500, fontSize: 14 }}>{item.text}</span>
            </div>
            <button
              type="button"
              style={{
                ...btnSmall,
                color: '#dc2626',
                borderColor: '#fecaca',
              }}
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </GroupList>
      <CodeBlock>{`const GroupList = kinetic('div')
  .enter({ opacity: 0, transform: 'translateX(-16px)' })
  .enterTo({ opacity: 1, transform: 'translateX(0)' })
  .enterTransition('opacity 300ms ease-out, transform 300ms ease-out')
  .leave({ opacity: 1, transform: 'translateX(0)' })
  .leaveTo({ opacity: 0, transform: 'translateX(16px)' })
  .leaveTransition('opacity 200ms ease-in, transform 200ms ease-in')
  .group()

<GroupList>
  {items.map(item => (
    <div key={item.id}>{item.text}</div>
  ))}
</GroupList>`}</CodeBlock>
    </div>
  )
}

// ─── 13. Stagger ────────────────────────────────────────────────────────────

function StaggerDemo() {
  const [show, setShow] = useState(false)
  const items = [
    { label: 'Dashboard', color: '#0070f3' },
    { label: 'Analytics', color: '#7c3aed' },
    { label: 'Settings', color: '#059669' },
    { label: 'Profile', color: '#d97706' },
    { label: 'Billing', color: '#dc2626' },
    { label: 'Support', color: '#2563eb' },
  ]

  return (
    <div style={card}>
      <h3 style={cardTitle}>Stagger</h3>
      <p style={cardDesc}>
        <code>.stagger({'{ interval }'})</code> adds incremental delay to each
        child. Each child gets <code>transitionDelay</code> and{' '}
        <code>--stagger-index</code> CSS custom property.
      </p>
      <div style={btnRow}>
        <button
          type="button"
          style={btnPrimary}
          onClick={() => setShow((s) => !s)}
        >
          {show ? 'Hide' : 'Show'} Menu
        </button>
      </div>
      <StaggerMenu show={show} appear>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#fff',
              border: '1px solid #e9ecef',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {item.label[0]}
            </div>
            <span style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</span>
          </div>
        ))}
      </StaggerMenu>
      <CodeBlock>{`const StaggerMenu = kinetic('div')
  .preset(slideUp)
  .stagger({ interval: 75 })

<StaggerMenu show={show} appear>
  {items.map(item => (
    <div key={item.label}>{item.label}</div>
  ))}
</StaggerMenu>`}</CodeBlock>
    </div>
  )
}

// ─── 14. Stagger with Reverse Leave ─────────────────────────────────────────

function StaggerReverseDemo() {
  const [show, setShow] = useState(false)

  const notifications = [
    { id: 1, text: 'New message from Alice', time: '2m ago', color: '#0070f3' },
    { id: 2, text: 'Build succeeded', time: '5m ago', color: '#059669' },
    { id: 3, text: 'Deploy to production', time: '12m ago', color: '#7c3aed' },
    { id: 4, text: 'PR review requested', time: '1h ago', color: '#d97706' },
  ]

  return (
    <div style={card}>
      <h3 style={cardTitle}>Stagger with Reverse Leave</h3>
      <p style={cardDesc}>
        <code>reverseLeave: true</code> reverses the stagger order on exit.
        Items disappear in the opposite order from how they appeared.
      </p>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setShow((s) => !s)}
      >
        {show ? 'Dismiss' : 'Show'} Notifications
      </button>
      <div style={{ marginTop: 16 }}>
        <StaggerNotifications show={show} appear>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: '#fff',
                border: '1px solid #e9ecef',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderLeft: `3px solid ${n.color}`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{n.text}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                  {n.time}
                </div>
              </div>
            </div>
          ))}
        </StaggerNotifications>
      </div>
      <CodeBlock>{`const StaggerNotifications = kinetic('div')
  .enter({ opacity: 0, transform: 'translateX(24px)' })
  .enterTo({ opacity: 1, transform: 'translateX(0)' })
  .enterTransition('opacity 300ms ease-out, transform 300ms ease-out')
  .leave({ opacity: 1, transform: 'translateX(0)' })
  .leaveTo({ opacity: 0, transform: 'translateX(-24px)' })
  .leaveTransition('opacity 200ms ease-in, transform 200ms ease-in')
  .stagger({ interval: 100, reverseLeave: true })`}</CodeBlock>
    </div>
  )
}

// ─── 15. Staggered Card Grid ────────────────────────────────────────────────

function CardGridDemo() {
  const [show, setShow] = useState(false)

  const cards = [
    {
      title: 'Transition',
      desc: 'Core enter/exit animation',
      color: '#0070f3',
    },
    { title: 'Group', desc: 'Animated list reconciliation', color: '#7c3aed' },
    { title: 'Stagger', desc: 'Staggered entrance effects', color: '#059669' },
    {
      title: 'Collapse',
      desc: 'Height-based expand/collapse',
      color: '#d97706',
    },
    {
      title: 'Presets',
      desc: 'Ready-made animation configs',
      color: '#dc2626',
    },
    {
      title: 'Hooks',
      desc: 'Low-level animation primitives',
      color: '#2563eb',
    },
  ]

  return (
    <div style={card}>
      <h3 style={cardTitle}>Staggered Card Grid</h3>
      <p style={cardDesc}>
        Combine <code>.preset(scaleIn)</code> with <code>.stagger()</code> for a
        satisfying grid entrance animation.
      </p>
      <button
        type="button"
        style={btnPrimary}
        onClick={() => setShow((s) => !s)}
      >
        {show ? 'Hide' : 'Show'} Cards
      </button>
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        <StaggerCardGrid show={show} appear>
          {cards.map((c) => (
            <div
              key={c.title}
              style={{
                padding: 20,
                borderRadius: 12,
                background: '#fff',
                border: '1px solid #e9ecef',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: c.color,
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {c.title[0]}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                {c.title}
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>{c.desc}</div>
            </div>
          ))}
        </StaggerCardGrid>
      </div>
      <CodeBlock>{`const StaggerCardGrid = kinetic('div')
  .preset(scaleIn)
  .stagger({ interval: 60 })

<StaggerCardGrid show={show} appear>
  {cards.map(c => <div key={c.title}>...</div>)}
</StaggerCardGrid>`}</CodeBlock>
    </div>
  )
}

// ─── 16. Modal with Overlay ─────────────────────────────────────────────────

function ModalDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div style={card}>
      <h3 style={cardTitle}>Combined: Modal with Overlay</h3>
      <p style={cardDesc}>
        Compose separate kinetic components for backdrop and dialog. Each has
        independent timing and animation.
      </p>
      <button type="button" style={btnPrimary} onClick={() => setOpen(true)}>
        Open Modal
      </button>

      {/* Backdrop */}
      <Backdrop
        show={open}
        onClick={() => setOpen(false)}
        aria-label="Close modal"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 100,
          border: 'none',
          cursor: 'pointer',
        }}
      />

      {/* Dialog */}
      <Dialog
        show={open}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 101,
          width: '90%',
          maxWidth: 400,
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>
          Modal Title
        </h3>
        <p
          style={{
            margin: '0 0 24px',
            fontSize: 14,
            color: '#555',
            lineHeight: 1.6,
          }}
        >
          This modal uses two kinetic() components: Backdrop with fade and Dialog
          with spring scale-in. Each is defined once and reused anywhere.
        </p>
        <button type="button" style={btnPrimary} onClick={() => setOpen(false)}>
          Close Modal
        </button>
      </Dialog>
      <CodeBlock>{`const Backdrop = kinetic('button')
  .enter({ opacity: 0 })
  .enterTo({ opacity: 1 })
  .enterTransition('opacity 300ms ease-out')
  .leave({ opacity: 1 })
  .leaveTo({ opacity: 0 })
  .leaveTransition('opacity 200ms ease-in')

const Dialog = kinetic('div')
  .enter({ opacity: 0, transform: 'scale(0.9) translateY(20px)' })
  .enterTo({ opacity: 1, transform: 'scale(1) translateY(0)' })
  .enterTransition('all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)')
  .leave({ opacity: 1 })
  .leaveTo({ opacity: 0, transform: 'scale(0.95) translateY(10px)' })
  .leaveTransition('all 200ms ease-in')

<Backdrop show={open} onClick={close} style={{ ... }} />
<Dialog show={open} style={{ ... }}>Content</Dialog>`}</CodeBlock>
    </div>
  )
}

// ─── 17. Tooltip Demo ───────────────────────────────────────────────────────

function TooltipDemo() {
  const [active, setActive] = useState<string | null>(null)

  // Build directional tooltip components from presets
  const tooltips = [
    { name: 'Top', Comp: kinetic('div').preset(slideDown) },
    { name: 'Bottom', Comp: kinetic('div').preset(slideUp) },
    { name: 'Left', Comp: kinetic('div').preset(slideRight) },
    { name: 'Right', Comp: kinetic('div').preset(slideLeft) },
  ]

  const getTooltipStyle = (position: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      padding: '6px 12px',
      borderRadius: 6,
      background: '#1a1a2e',
      color: '#fff',
      fontSize: 12,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      zIndex: 10,
      pointerEvents: 'none',
    }
    switch (position) {
      case 'Top':
        return {
          ...base,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 8,
        }
      case 'Bottom':
        return {
          ...base,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 8,
        }
      case 'Left':
        return {
          ...base,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: 8,
        }
      case 'Right':
        return {
          ...base,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: 8,
        }
      default:
        return base
    }
  }

  return (
    <div style={card}>
      <h3 style={cardTitle}>Tooltips (Directional Presets)</h3>
      <p style={cardDesc}>
        Create directional tooltip components from presets. Each uses the
        opposite slide direction for a natural reveal.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          padding: '40px 0',
        }}
      >
        {tooltips.map(({ name, Comp }) => (
          <div
            key={name}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <button
              type="button"
              style={btn}
              onMouseEnter={() => setActive(name)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(name)}
              onBlur={() => setActive(null)}
            >
              {name}
            </button>
            <Comp show={active === name} style={getTooltipStyle(name)}>
              Tooltip {name.toLowerCase()}
            </Comp>
          </div>
        ))}
      </div>
      <CodeBlock>{`const TooltipTop = kinetic('div').preset(slideDown)
const TooltipBottom = kinetic('div').preset(slideUp)
const TooltipLeft = kinetic('div').preset(slideRight)
const TooltipRight = kinetic('div').preset(slideLeft)`}</CodeBlock>
    </div>
  )
}

// ─── 18. Toast Notifications ────────────────────────────────────────────────

let toastId = 0

function ToastDemo() {
  const [toasts, setToasts] = useState<
    { id: number; text: string; color: string }[]
  >([])

  const addToast = () => {
    const id = toastId++
    const messages = [
      'File saved successfully',
      'User profile updated',
      'Email sent',
      'New comment received',
      'Build completed',
      'Deployment started',
    ]
    const colors = ['#059669', '#0070f3', '#7c3aed', '#d97706', '#dc2626']
    setToasts((prev) => [
      ...prev,
      {
        id,
        text: messages[id % messages.length],
        color: colors[id % colors.length],
      },
    ])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <div style={card}>
      <h3 style={cardTitle}>Notification Toasts (Group Mode)</h3>
      <p style={cardDesc}>
        Real-world toast notifications using <code>.group()</code>. Items
        auto-dismiss after 3 seconds or can be clicked to dismiss immediately.
      </p>
      <button type="button" style={btnPrimary} onClick={addToast}>
        Add Toast
      </button>
      <div
        style={{
          marginTop: 16,
          position: 'relative',
          minHeight: toasts.length > 0 ? 60 : 0,
        }}
      >
        <ToastGroup>
          {toasts.map((toast) => (
            <button
              type="button"
              key={toast.id}
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: '#fff',
                border: '1px solid #e9ecef',
                borderLeft: `3px solid ${toast.color}`,
                marginBottom: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                width: '100%',
                textAlign: 'left',
                font: 'inherit',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: toast.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {toast.text}
              </span>
              <span style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>
                click to dismiss
              </span>
            </button>
          ))}
        </ToastGroup>
      </div>
      <CodeBlock>{`const ToastGroup = kinetic('div')
  .enter({ opacity: 0, transform: 'translateY(-8px) scale(0.98)' })
  .enterTo({ opacity: 1, transform: 'translateY(0) scale(1)' })
  .enterTransition('all 300ms ease-out')
  .leave({ opacity: 1 })
  .leaveTo({ opacity: 0, transform: 'translateX(100px)' })
  .leaveTransition('all 250ms ease-in')
  .group()

<ToastGroup>
  {toasts.map(t => <div key={t.id}>...</div>)}
</ToastGroup>`}</CodeBlock>
    </div>
  )
}

// ─── 19. Tabs with Cross-Fade ───────────────────────────────────────────────

function TabsDemo() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      label: 'Overview',
      content:
        'The kinetic() chaining API provides CSS-first animation primitives for React. It weighs ~3KB gzipped and supports enter/exit transitions, staggered animations, height collapse, and key-based list reconciliation.',
    },
    {
      label: 'Installation',
      content:
        'npm install @vitus-labs/kinetic @vitus-labs/hooks\n\nBoth packages are required. @vitus-labs/hooks provides useReducedMotion, useMergedRef, and useIsomorphicLayoutEffect.',
    },
    {
      label: 'API',
      content:
        'kinetic(tag) → .preset() .enter() .enterTo() .enterTransition() .leave() .leaveTo() .leaveTransition() .enterClass() .leaveClass() .config() .on() .collapse() .stagger() .group()',
    },
  ]

  return (
    <div style={card}>
      <h3 style={cardTitle}>Tabs with Cross-Fade</h3>
      <p style={cardDesc}>
        Use a fade transition component to cross-fade between tab panels.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '2px solid #e9ecef',
          marginBottom: 16,
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(i)}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === i ? '#0070f3' : 'transparent'}`,
              marginBottom: -2,
              cursor: 'pointer',
              fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? '#0070f3' : '#666',
              fontSize: 14,
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ position: 'relative', minHeight: 80 }}>
        {tabs.map((tab, i) => (
          <FadeDiv
            key={tab.label}
            show={activeTab === i}
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: '#555',
              whiteSpace: 'pre-line',
            }}
          >
            {tab.content}
          </FadeDiv>
        ))}
      </div>
    </div>
  )
}

// ─── 20. Full API Reference ─────────────────────────────────────────────────

function APIReference() {
  return (
    <div style={card}>
      <h3 style={cardTitle}>Complete API Reference</h3>
      <p style={cardDesc}>
        Every chain method and prop available in the kinetic() API.
      </p>
      <CodeBlock>{`import { kinetic, presets, fade, scaleIn, slideUp } from '@vitus-labs/kinetic'
import type { KineticComponent, Preset } from '@vitus-labs/kinetic'

// ── Entry point ────────────────────────────────────
kinetic(tag)                     // 'div' | 'section' | MyComponent | any ElementType

// ── Style-based animation (chain methods) ──────────
.enter(styles)                  // CSSProperties — initial enter state
.enterTo(styles)                // CSSProperties — final enter state
.enterTransition(value)         // string — CSS transition for enter
.leave(styles)                  // CSSProperties — initial leave state
.leaveTo(styles)                // CSSProperties — final leave state
.leaveTransition(value)         // string — CSS transition for leave

// ── Class-based animation ──────────────────────────
.enterClass({ active, from, to })  // CSS class names for enter phases
.leaveClass({ active, from, to })  // CSS class names for leave phases

// ── Presets ────────────────────────────────────────
.preset(preset)                 // StyleTransitionProps & ClassTransitionProps

// ── Behavior config ────────────────────────────────
.config({ appear, unmount, timeout })  // mode-specific options
.on({ onEnter, onAfterEnter, onLeave, onAfterLeave })

// ── Mode switches ──────────────────────────────────
.collapse({ transition? })      // → height animation mode
.stagger({ interval?, reverseLeave? })  // → staggered children mode
.group()                        // → key-based enter/exit mode

// ── Component props (vary by mode) ─────────────────
// Transition: show, appear?, unmount?, timeout?, ...HTML attrs
// Collapse:   show, appear?, timeout?, transition?, ...HTML attrs
// Stagger:    show, appear?, timeout?, interval?, reverseLeave?, ...HTML attrs
// Group:      appear?, timeout?, ...HTML attrs (NO show prop)

// All modes also accept: onEnter, onAfterEnter, onLeave, onAfterLeave`}</CodeBlock>
    </div>
  )
}

// ─── Kinetic Presets: Gallery Card ──────────────────────────────────────────

const presetCardBox: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 8,
  color: '#fff',
  fontWeight: 600,
  fontSize: 13,
  textAlign: 'center',
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

function PresetCard({ name, color }: { name: string; color: string }) {
  const [show, setShow] = useState(false)
  const Comp = presetComponents[name]
  if (!Comp) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        style={{
          ...btnSmall,
          width: '100%',
          marginBottom: 8,
          background: show ? color : '#fff',
          color: show ? '#fff' : '#333',
          borderColor: show ? color : '#dee2e6',
        }}
      >
        {show ? 'Hide' : 'Show'}
      </button>
      <Comp show={show} style={{ ...presetCardBox, background: color }}>
        {name}
      </Comp>
    </div>
  )
}

// ─── 21. Kinetic Presets Gallery ─────────────────────────────────────────────

function KineticPresetsGallery() {
  const [expanded, setExpanded] = useState<string | null>(
    PRESET_CATEGORIES[0].name,
  )

  return (
    <div style={card}>
      <h3 style={cardTitle}>122 Animation Presets</h3>
      <p style={cardDesc}>
        Every preset from <code>@vitus-labs/kinetic-presets</code>. Click a
        category to expand, then toggle individual presets.
      </p>
      <CodeBlock>{`import { fade, slideUp, bounceIn, presets } from '@vitus-labs/kinetic-presets'

// Use individual named exports (tree-shakeable)
const FadeBox = kinetic('div').preset(fade)
const BounceBox = kinetic('div').preset(bounceIn)

// Or use the presets map for dynamic selection
const MyBox = kinetic('div').preset(presets.slideUp)`}</CodeBlock>
      <div style={{ marginTop: 16 }}>
        {PRESET_CATEGORIES.map((cat) => (
          <div key={cat.name} style={{ marginBottom: 8 }}>
            <button
              type="button"
              onClick={() =>
                setExpanded((v) => (v === cat.name ? null : cat.name))
              }
              style={{
                ...accordionHeader,
                borderColor: expanded === cat.name ? cat.color : '#e9ecef',
                color: expanded === cat.name ? cat.color : '#333',
              }}
            >
              <span>
                {cat.name}{' '}
                <span style={{ fontWeight: 400, color: '#999' }}>
                  ({cat.items.length})
                </span>
              </span>
              <span>{expanded === cat.name ? '▼' : '▶'}</span>
            </button>
            {expanded === cat.name && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: 10,
                  padding: '12px 0',
                }}
              >
                {cat.items.map((name) => (
                  <PresetCard key={name} name={name} color={cat.color} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 22. Toggle All Presets ──────────────────────────────────────────────────

function ToggleAllPresets() {
  const [showAll, setShowAll] = useState(false)

  return (
    <div style={card}>
      <h3 style={cardTitle}>Toggle All (Stress Test)</h3>
      <p style={cardDesc}>
        Toggle all 122 presets simultaneously to see them animate in parallel.
      </p>
      <div style={btnRow}>
        <button
          type="button"
          style={btnPrimary}
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? 'Hide All 122' : 'Show All 122'}
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 8,
        }}
      >
        {Object.entries(presetComponents).map(([name, Comp]) => (
          <Comp
            key={name}
            show={showAll}
            style={{
              ...presetCardBox,
              background: '#495057',
              fontSize: 11,
            }}
          >
            {name}
          </Comp>
        ))}
      </div>
    </div>
  )
}

// ─── 23. Factory Functions ───────────────────────────────────────────────────

function FactoryDemo() {
  const [active, setActive] = useState<string | null>(null)

  const factories = [
    {
      name: 'createFade',
      Comp: FactoryFadeUp,
      color: '#0070f3',
      code: "createFade({ direction: 'up', distance: 24, duration: 400 })",
    },
    {
      name: 'createSlide',
      Comp: FactorySlideRight,
      color: '#059669',
      code: "createSlide({ direction: 'right', distance: 32, duration: 350 })",
    },
    {
      name: 'createScale',
      Comp: FactoryScaleSpring,
      color: '#7c3aed',
      code: "createScale({ from: 0.5, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' })",
    },
    {
      name: 'createRotate',
      Comp: FactoryRotate,
      color: '#d97706',
      code: 'createRotate({ degrees: 30, duration: 400 })',
    },
    {
      name: 'createBlur',
      Comp: FactoryBlurScale,
      color: '#6366f1',
      code: 'createBlur({ amount: 12, scale: 0.9, duration: 400 })',
    },
  ]

  return (
    <div style={card}>
      <h3 style={cardTitle}>Factory Functions</h3>
      <p style={cardDesc}>
        Create custom presets with configurable options. Each factory returns a{' '}
        <code>Preset</code> object you can pass to{' '}
        <code>kinetic().preset()</code>.
      </p>
      <CodeBlock>{`import { createFade, createSlide, createScale, createRotate, createBlur } from '@vitus-labs/kinetic-presets'

// Custom fade: slide up 24px over 400ms
const CustomFade = kinetic('div').preset(
  createFade({ direction: 'up', distance: 24, duration: 400 })
)

// Spring scale from 50%
const SpringScale = kinetic('div').preset(
  createScale({ from: 0.5, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' })
)

// Blur with scale effect
const BlurScale = kinetic('div').preset(
  createBlur({ amount: 12, scale: 0.9, duration: 400 })
)`}</CodeBlock>
      <div style={{ marginTop: 16 }}>
        {factories.map(({ name, Comp, color, code }) => (
          <div
            key={name}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              background: '#fff',
              border: '1px solid #e9ecef',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
              }}
            >
              <button
                type="button"
                style={{
                  ...btn,
                  background: active === name ? color : '#fff',
                  color: active === name ? '#fff' : '#333',
                  borderColor: active === name ? color : '#dee2e6',
                }}
                onClick={() => setActive((v) => (v === name ? null : name))}
              >
                {active === name ? 'Hide' : 'Show'}
              </button>
              <code style={{ fontSize: 12, color: '#555' }}>{code}</code>
            </div>
            <Comp
              show={active === name}
              style={{ ...presetCardBox, background: color }}
            >
              {name}
            </Comp>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 24. Composition Utilities ───────────────────────────────────────────────

function CompositionDemo() {
  const [active, setActive] = useState<string | null>(null)

  const utilities = [
    {
      name: 'compose',
      Comp: ComposedFadeSlide,
      color: '#0070f3',
      desc: 'Merge fade + slideUp into one animation',
      code: 'compose(presets.fade, presets.slideUp)',
    },
    {
      name: 'withDuration',
      Comp: SlowFade,
      color: '#059669',
      desc: 'Override timing: 800ms enter, 500ms leave',
      code: 'withDuration(presets.fade, 800, 500)',
    },
    {
      name: 'withEasing',
      Comp: SpringEased,
      color: '#7c3aed',
      desc: 'Spring easing on scaleIn',
      code: "withEasing(presets.scaleIn, 'cubic-bezier(0.34, 1.56, 0.64, 1)')",
    },
    {
      name: 'withDelay',
      Comp: DelayedFade,
      color: '#d97706',
      desc: '200ms enter delay, no leave delay',
      code: 'withDelay(presets.fadeUp, 200, 0)',
    },
    {
      name: 'reverse',
      Comp: ReversedSlide,
      color: '#dc2626',
      desc: 'Swap enter ↔ leave of slideUp',
      code: 'reverse(presets.slideUp)',
    },
  ]

  return (
    <div style={card}>
      <h3 style={cardTitle}>Composition Utilities</h3>
      <p style={cardDesc}>
        Transform and combine existing presets without creating new ones from
        scratch.
      </p>
      <CodeBlock>{`import { compose, withDuration, withEasing, withDelay, reverse, presets } from '@vitus-labs/kinetic-presets'

// Merge multiple presets (styles shallow-merged, last wins)
const FadeSlide = kinetic('div').preset(compose(presets.fade, presets.slideUp))

// Override timing
const SlowFade = kinetic('div').preset(withDuration(presets.fade, 800, 500))

// Override easing
const SpringScale = kinetic('div').preset(
  withEasing(presets.scaleIn, 'cubic-bezier(0.34, 1.56, 0.64, 1)')
)

// Add delay (200ms enter, 0ms leave)
const Delayed = kinetic('div').preset(withDelay(presets.fadeUp, 200, 0))

// Swap enter ↔ leave (enter slides down, leave slides up)
const Reversed = kinetic('div').preset(reverse(presets.slideUp))`}</CodeBlock>
      <div style={{ marginTop: 16 }}>
        {utilities.map(({ name, Comp, color, desc, code }) => (
          <div
            key={name}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              background: '#fff',
              border: '1px solid #e9ecef',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 4,
              }}
            >
              <button
                type="button"
                style={{
                  ...btn,
                  background: active === name ? color : '#fff',
                  color: active === name ? '#fff' : '#333',
                  borderColor: active === name ? color : '#dee2e6',
                }}
                onClick={() => setActive((v) => (v === name ? null : name))}
              >
                {active === name ? 'Hide' : 'Show'}
              </button>
              <div>
                <code style={{ fontSize: 12, fontWeight: 600 }}>{name}()</code>
                <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>
                  {desc}
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#999',
                fontFamily: 'monospace',
                marginBottom: 8,
                marginLeft: 88,
              }}
            >
              {code}
            </div>
            <Comp
              show={active === name}
              style={{ ...presetCardBox, background: color }}
            >
              {name}()
            </Comp>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 25. Advanced Composition Patterns ───────────────────────────────────────

const ComposedBounceBlur = kinetic('div').preset(
  compose(presets.bounceIn, withDuration(presets.blurIn, 500, 200)),
)
const StaggeredPresets = kinetic('div')
  .preset(presets.fadeUp)
  .stagger({ interval: 80 })

function AdvancedCompositionDemo() {
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)

  return (
    <div style={card}>
      <h3 style={cardTitle}>Advanced Composition Patterns</h3>
      <p style={cardDesc}>
        Combine kinetic-presets with kinetic() modes for sophisticated effects.
      </p>
      <CodeBlock>{`// Compose bounce + blur for a combined effect
const BounceBlur = kinetic('div').preset(
  compose(presets.bounceIn, withDuration(presets.blurIn, 500, 200))
)

// Stagger kinetic presets across multiple children
const StaggeredCards = kinetic('div')
  .preset(presets.fadeUp)
  .stagger({ interval: 80 })`}</CodeBlock>

      <div style={{ marginTop: 16 }}>
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: '#fff',
            border: '1px solid #e9ecef',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8,
            }}
          >
            <button
              type="button"
              style={{
                ...btn,
                background: show1 ? '#e11d48' : '#fff',
                color: show1 ? '#fff' : '#333',
                borderColor: show1 ? '#e11d48' : '#dee2e6',
              }}
              onClick={() => setShow1((v) => !v)}
            >
              {show1 ? 'Hide' : 'Show'}
            </button>
            <code style={{ fontSize: 12 }}>
              compose(bounceIn, withDuration(blurIn, 500, 200))
            </code>
          </div>
          <ComposedBounceBlur
            show={show1}
            style={{ ...presetCardBox, background: '#e11d48' }}
          >
            Bounce + Blur
          </ComposedBounceBlur>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: '#fff',
            border: '1px solid #e9ecef',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8,
            }}
          >
            <button
              type="button"
              style={{
                ...btn,
                background: show2 ? '#0891b2' : '#fff',
                color: show2 ? '#fff' : '#333',
                borderColor: show2 ? '#0891b2' : '#dee2e6',
              }}
              onClick={() => setShow2((v) => !v)}
            >
              {show2 ? 'Hide' : 'Show'}
            </button>
            <code style={{ fontSize: 12 }}>
              preset(fadeUp).stagger({'{'} interval: 80 {'}'})
            </code>
          </div>
          <StaggeredPresets show={show2}>
            {['Card A', 'Card B', 'Card C', 'Card D'].map((label) => (
              <div
                key={label}
                style={{
                  ...presetCardBox,
                  background: '#0891b2',
                  marginBottom: 8,
                }}
              >
                {label}
              </div>
            ))}
          </StaggeredPresets>
        </div>
      </div>
    </div>
  )
}

// ─── 26. Kinetic Presets Quick Reference ─────────────────────────────────────

function KineticReference() {
  return (
    <div style={card}>
      <h3 style={cardTitle}>Kinetic Presets — Quick Reference</h3>
      <p style={cardDesc}>
        Complete API surface of <code>@vitus-labs/kinetic-presets</code>.
      </p>
      <CodeBlock>{`import {
  // ── 122 Named Presets (tree-shakeable) ───────────
  fade, fadeUp, fadeDown, fadeLeft, fadeRight,
  fadeUpBig, fadeDownBig, fadeLeftBig, fadeRightBig, fadeScale,
  slideUp, slideDown, slideLeft, slideRight,
  slideUpBig, slideDownBig, slideLeftBig, slideRightBig,
  scaleIn, scaleOut, scaleUp, scaleDown,
  scaleInUp, scaleInDown, scaleInLeft, scaleInRight,
  zoomIn, zoomOut, zoomInUp, zoomInDown, zoomInLeft, zoomInRight,
  flipX, flipY, flipXReverse, flipYReverse,
  rotateIn, rotateInReverse, rotateInUp, rotateInDown, spinIn, spinInReverse,
  bounceIn, bounceInUp, bounceInDown, bounceInLeft, bounceInRight, springIn,
  blurIn, blurInUp, blurInDown, blurScale,
  clipTop, clipBottom, clipLeft, clipRight,
  perspectiveUp, perspectiveDown, perspectiveLeft, perspectiveRight,
  expandX, expandY, skewIn, skewInReverse, drop, rise,
  presets,             // All 122 as { [name]: Preset } map

  // ── Factories ────────────────────────────────────
  createFade,          // ({ direction?, distance?, duration?, easing? }) => Preset
  createSlide,         // ({ direction?, distance?, duration?, easing? }) => Preset
  createScale,         // ({ from?, duration?, easing? }) => Preset
  createRotate,        // ({ degrees?, duration?, easing? }) => Preset
  createBlur,          // ({ amount?, scale?, duration?, easing? }) => Preset

  // ── Utilities ────────────────────────────────────
  compose,             // (...presets) => Preset    — merge multiple presets
  withDuration,        // (preset, enterMs, leaveMs?) => Preset
  withEasing,          // (preset, enterEasing, leaveEasing?) => Preset
  withDelay,           // (preset, enterDelayMs, leaveDelayMs?) => Preset
  reverse,             // (preset) => Preset        — swap enter ↔ leave
} from '@vitus-labs/kinetic-presets'
import type { Preset, Direction, FadeOptions, SlideOptions, ScaleOptions, RotateOptions, BlurOptions } from '@vitus-labs/kinetic-presets'

// ── Usage with kinetic() ────────────────────────────
const FadeBox = kinetic('div').preset(fade)
const CustomSlide = kinetic('div').preset(createSlide({ direction: 'left', distance: 32 }))
const FadeSlide = kinetic('div').preset(compose(fade, slideUp))
const SlowBounce = kinetic('div').preset(withDuration(bounceIn, 800))
const SpringScale = kinetic('div').preset(withEasing(scaleIn, 'cubic-bezier(0.34, 1.56, 0.64, 1)'))
const SlideDownOnLeave = kinetic('div').preset(reverse(slideUp))`}</CodeBlock>
    </div>
  )
}

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={wrapper}>
      <span style={badge}>@vitus-labs/kinetic</span>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 4px' }}>
        kinetic() Chaining API
      </h1>
      <p style={{ fontSize: '1rem', color: '#666', margin: '0 0 8px' }}>
        CSS-first animation library for React — ~3KB gzipped
      </p>
      <p style={{ fontSize: '0.875rem', color: '#999', margin: '0 0 16px' }}>
        Interactive examples covering every mode, chain method, and pattern
      </p>

      <h2 style={sectionTitle}>Transition Mode (Default)</h2>
      <PresetShowcase />
      <StyleObjectDemo />
      <ClassBasedDemo />
      <ChainingDemo />
      <CustomTagDemo />
      <AppearDemo />
      <UnmountDemo />
      <LifecycleDemo />

      <h2 style={sectionTitle}>Collapse Mode</h2>
      <CollapseDemo />
      <CollapseCustomDemo />
      <NestedCollapseDemo />

      <h2 style={sectionTitle}>Group Mode</h2>
      <GroupDemo />
      <ToastDemo />

      <h2 style={sectionTitle}>Stagger Mode</h2>
      <StaggerDemo />
      <StaggerReverseDemo />
      <CardGridDemo />

      <h2 style={sectionTitle}>Composed Patterns</h2>
      <TabsDemo />
      <ModalDemo />
      <TooltipDemo />

      <h2 style={sectionTitle}>Kinetic Presets Library</h2>
      <KineticPresetsGallery />
      <ToggleAllPresets />
      <FactoryDemo />
      <CompositionDemo />
      <AdvancedCompositionDemo />

      <h2 style={sectionTitle}>Reference</h2>
      <APIReference />
      <KineticReference />
    </div>
  )
}
