# @vitus-labs/kinetic

CSS-first animation library for React. Enter/exit transitions, staggered animations, height collapse, and list reconciliation — all in ~3KB gzipped.

[![npm](https://img.shields.io/npm/v/@vitus-labs/kinetic)](https://www.npmjs.com/package/@vitus-labs/kinetic)
[![gzip size](https://img.shields.io/badge/gzip-3.2KB-brightgreen)](https://bundlephobia.com/package/@vitus-labs/kinetic)
[![license](https://img.shields.io/npm/l/@vitus-labs/kinetic)](./LICENSE)

## Why Kinetic?

Most React animation libraries run their own JavaScript animation loop on the main thread. Kinetic takes a different approach: it delegates all interpolation to the browser's CSS transition engine (compositor thread for `transform`/`opacity`), and only handles orchestration — mount/unmount lifecycle, stagger timing, height measurement, and list diffing.

The result: GPU-composited 60/120 FPS animations with a 3.2KB footprint.

### How It Compares

| Library | Gzipped | Engine | Enter/Exit | Stagger | List Recon. | Collapse | Reduced Motion |
| ------- | ------- | ------ | ---------- | ------- | ----------- | -------- | -------------- |
| **@vitus-labs/kinetic** | **3.2 KB** | CSS transitions | Yes | Yes | Yes | Yes | Yes |
| Motion (framer-motion) | ~34 KB | JS (rAF + WAAPI) | Yes | Yes | Yes | Quirky | Yes |
| @react-spring/web | ~16-24 KB | JS (spring physics) | Yes | Partial | Yes | Manual | Yes |
| react-transition-group | ~5 KB | CSS classes | Yes | No | Yes | No | No |
| @headlessui/react | ~12 KB | CSS transitions | Yes | No | No | No | No |
| AutoAnimate | ~2.5 KB | JS (FLIP) | Yes | No | Yes | No | Yes |
| GSAP + @gsap/react | ~27 KB | JS (proprietary) | Manual | Yes | Manual | Manual | No |

**Key advantages:**
- **10x smaller than Motion** for CSS-transition use cases
- **CSS-first**: `transform`/`opacity` run on GPU compositor thread, not main thread
- **Modern replacement for react-transition-group** (dead since 2022, broken on React 19)
- **Only library** combining CSS transitions + stagger + collapse + list reconciliation
- **122 presets** available via `@vitus-labs/kinetic-presets`

### Performance: CSS vs JS Animation Engines

| Approach | Thread | Main Thread Cost | FPS Under Load |
| -------- | ------ | ---------------- | -------------- |
| CSS transitions (kinetic) | Compositor (GPU) | Class/style toggle only | Stable 60/120 FPS |
| JS rAF (Motion, react-spring) | Main thread | Per-frame value computation | Degrades under heavy JS |
| WAAPI (Motion hybrid) | Compositor when possible | Setup cost + fallback to rAF | Mixed |

CSS transitions for `transform` and `opacity` can be GPU-composited — the browser handles interpolation off the main thread. Kinetic's JS overhead is limited to toggling classes/styles and coordinating timing, not computing values every frame.

**Tradeoff:** No spring physics, no gesture-driven values, no mid-flight interruptible animations. If you need those, use Motion or react-spring. If you need enter/exit/stagger/collapse transitions, kinetic does it at 1/10th the bundle cost.

## Install

```bash
npm install @vitus-labs/kinetic
# Peer dependency
npm install react
```

## Quick Start

```tsx
import { kinetic, fade, slideUp, presets } from '@vitus-labs/kinetic'

// Create animated components at module level
const FadeDiv = kinetic('div').preset(fade)
const SlideSection = kinetic('section').preset(slideUp)

// Use like normal React components
function App() {
  const [show, setShow] = useState(true)
  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle</button>
      <FadeDiv show={show}>Hello, world!</FadeDiv>
    </>
  )
}
```

## API

### `kinetic(tag)`

Creates an animated component. `tag` can be any HTML element string or React component.

```tsx
kinetic('div')        // HTML element
kinetic('section')    // Any HTML tag
kinetic(MyComponent)  // React component (must forward refs)
```

Returns a renderable React component with chain methods attached. Default mode: **transition**.

### Chain Methods

All methods return a new component (immutable). The tag generic flows through, preserving HTML attribute types.

```tsx
// Style-based animation config
.enter(styles)            // CSSProperties applied at enter start
.enterTo(styles)          // CSSProperties applied after first frame
.enterTransition(value)   // CSS transition string for enter
.leave(styles)            // CSSProperties applied at leave start
.leaveTo(styles)          // CSSProperties applied after first frame
.leaveTransition(value)   // CSS transition string for leave

// Class-based animation config
.enterClass({ active?, from?, to? })
.leaveClass({ active?, from?, to? })

// Apply a preset (spreads style + class props)
.preset(preset)

// Behavior config
.config(opts)             // appear, unmount, timeout (+ mode-specific)
.on(callbacks)            // onEnter, onAfterEnter, onLeave, onAfterLeave

// Mode switches
.collapse(opts?)          // Height animation mode
.stagger(opts?)           // Staggered children mode
.group()                  // Key-based list reconciliation mode
```

### Four Modes

#### Transition (default)

Single element enter/leave with CSS transitions.

```tsx
const FadeDiv = kinetic('div').preset(fade)

<FadeDiv show={isOpen}>Content</FadeDiv>
```

Props: `show`, `appear?`, `unmount?`, `timeout?`, lifecycle callbacks, + all tag attributes.

#### Collapse

Height animation with `overflow: hidden`. Measures `scrollHeight` automatically.

```tsx
const Accordion = kinetic('div').collapse()
const FancyAccordion = kinetic('section').collapse({
  transition: 'height 400ms cubic-bezier(0.4, 0, 0.2, 1)'
})

<Accordion show={isExpanded}>
  <p>Expandable content</p>
</Accordion>
```

#### Stagger

Staggered entrance/exit for child elements.

```tsx
const StaggerList = kinetic('ul').preset(slideUp).stagger({ interval: 75 })

<StaggerList show={isVisible}>
  <li key="1">Item 1</li>
  <li key="2">Item 2</li>
  <li key="3">Item 3</li>
</StaggerList>
```

Props: `show`, `interval?`, `reverseLeave?`, + tag attributes.

#### Group

Key-based enter/exit — adding a child triggers enter animation, removing triggers leave + unmount. No `show` prop.

```tsx
const AnimatedList = kinetic('ul').preset(fade).group()

<AnimatedList>
  {items.map(item => <li key={item.id}>{item.text}</li>)}
</AnimatedList>
```

### Inline Configuration

Build animations without presets:

```tsx
const SlidePanel = kinetic('aside')
  .enter({ opacity: 0, transform: 'translateX(-100%)' })
  .enterTo({ opacity: 1, transform: 'translateX(0)' })
  .enterTransition('all 300ms ease-out')
  .leave({ opacity: 1, transform: 'translateX(0)' })
  .leaveTo({ opacity: 0, transform: 'translateX(-100%)' })
  .leaveTransition('all 200ms ease-in')
```

### Class-Based Transitions

Works with Tailwind CSS, CSS modules, or any class-based approach:

```tsx
const TailwindFade = kinetic('div')
  .enterClass({ active: 'transition-opacity duration-300', from: 'opacity-0', to: 'opacity-100' })
  .leaveClass({ active: 'transition-opacity duration-200', from: 'opacity-100', to: 'opacity-0' })
```

### Type Inference

The tag determines which HTML attributes are accepted:

```tsx
const FadeDiv = kinetic('div').preset(fade)
<FadeDiv show className="x" onClick={fn} />  // div attributes

const FadeInput = kinetic('input').preset(fade)
<FadeInput show type="text" value="x" />      // input attributes

const FadeCustom = kinetic(MyComponent).preset(fade)
<FadeCustom show customProp="x" />             // MyComponent props
```

### Lifecycle Callbacks

```tsx
<FadeDiv
  show={isOpen}
  onEnter={() => console.log('entering')}
  onAfterEnter={() => console.log('entered')}
  onLeave={() => console.log('leaving')}
  onAfterLeave={() => console.log('left')}
>
  Content
</FadeDiv>
```

### Accessibility

Kinetic automatically detects `prefers-reduced-motion: reduce` via the `useReducedMotion` hook. When enabled, animations are skipped instantly — callbacks still fire, but no visual animation occurs. No configuration needed.

## Built-in Presets

Six presets are included in the core package:

```tsx
import { fade, scaleIn, slideUp, slideDown, slideLeft, slideRight } from '@vitus-labs/kinetic'
```

For 122 presets, factories, and composition utilities, install `@vitus-labs/kinetic-presets`.

## Hooks

Two low-level hooks are exported for custom animation patterns:

```tsx
import { useTransitionState, useAnimationEnd } from '@vitus-labs/kinetic'
```

- `useTransitionState` — state machine for enter/leave lifecycle (`hidden` → `entering` → `entered` → `leaving` → `hidden`)
- `useAnimationEnd` — detects `transitionend`/`animationend` with timeout fallback

## Composition with Rocketstyle

Kinetic and rocketstyle compose naturally — no integration package needed:

```tsx
import rocketstyle from '@vitus-labs/rocketstyle'

const Button = rocketstyle()({ component: 'button', name: 'Button' })
  .theme({ primaryColor: 'blue' })

const AnimatedButton = kinetic(Button).preset(fade)

// Has both rocketstyle props AND kinetic props
<AnimatedButton show={isVisible} primary size="large">Click me</AnimatedButton>
```

## Requirements

- React >= 19
- TypeScript >= 5 (recommended)

## License

MIT
