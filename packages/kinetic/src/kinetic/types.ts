import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactElement,
  ReactNode,
} from 'react'
import type {
  ClassTransitionProps,
  StyleTransitionProps,
  TransitionCallbacks,
} from '../types'

// ─── Kinetic Modes ────────────────────────────────────────

export type KineticMode = 'transition' | 'collapse' | 'stagger' | 'group'

// ─── Internal Config (accumulated through chaining) ──────

export type KineticConfig = StyleTransitionProps &
  ClassTransitionProps &
  TransitionCallbacks & {
    tag: ElementType
    mode: KineticMode
    appear?: boolean
    unmount?: boolean
    timeout?: number
    /** Collapse: CSS transition for height. */
    transition?: string
    /** Stagger: delay between each child in ms. */
    interval?: number
    /** Stagger: reverse order on leave. */
    reverseLeave?: boolean
  }

// ─── Class Config (for .enterClass / .leaveClass) ────────

export type ClassConfig = {
  active?: string
  from?: string
  to?: string
}

// ─── Mode-specific config options for .config() ──────────

export type TransitionConfigOpts = {
  appear?: boolean
  unmount?: boolean
  timeout?: number
}

export type CollapseConfigOpts = {
  appear?: boolean
  timeout?: number
  transition?: string
}

export type StaggerConfigOpts = {
  appear?: boolean
  timeout?: number
  interval?: number
  reverseLeave?: boolean
}

export type GroupConfigOpts = {
  appear?: boolean
  timeout?: number
}

// ─── Mode-specific component props ───────────────────────

/** Keys that belong to kinetic and should NOT be forwarded as HTML attributes. */
type KineticOwnKeys =
  | 'show'
  | 'appear'
  | 'unmount'
  | 'timeout'
  | 'transition'
  | 'interval'
  | 'reverseLeave'
  | keyof TransitionCallbacks
  | 'children'

type BaseHTMLProps<Tag extends ElementType> = Omit<
  ComponentPropsWithRef<Tag>,
  KineticOwnKeys
>

export type KineticTransitionProps<Tag extends ElementType> =
  BaseHTMLProps<Tag> & {
    show: boolean
    appear?: boolean
    unmount?: boolean
    timeout?: number
    children?: ReactNode
  } & Partial<TransitionCallbacks>

export type KineticCollapseProps<Tag extends ElementType> =
  BaseHTMLProps<Tag> & {
    show: boolean
    appear?: boolean
    timeout?: number
    transition?: string
    children?: ReactNode
  } & Partial<TransitionCallbacks>

export type KineticStaggerProps<Tag extends ElementType> =
  BaseHTMLProps<Tag> & {
    show: boolean
    appear?: boolean
    timeout?: number
    interval?: number
    reverseLeave?: boolean
    children: ReactElement[]
  } & Partial<TransitionCallbacks>

export type KineticGroupProps<Tag extends ElementType> = BaseHTMLProps<Tag> & {
  appear?: boolean
  timeout?: number
  children: ReactElement[]
} & Partial<TransitionCallbacks>

// ─── Conditional props based on mode ─────────────────────

export type KineticComponentProps<
  Tag extends ElementType,
  Mode extends KineticMode,
> = Mode extends 'collapse'
  ? KineticCollapseProps<Tag>
  : Mode extends 'stagger'
    ? KineticStaggerProps<Tag>
    : Mode extends 'group'
      ? KineticGroupProps<Tag>
      : KineticTransitionProps<Tag>

// ─── Conditional config opts based on mode ───────────────

type ConfigOpts<Mode extends KineticMode> = Mode extends 'collapse'
  ? CollapseConfigOpts
  : Mode extends 'stagger'
    ? StaggerConfigOpts
    : Mode extends 'group'
      ? GroupConfigOpts
      : TransitionConfigOpts

// ─── Chain methods ───────────────────────────────────────

export type KineticChain<Tag extends ElementType, Mode extends KineticMode> = {
  preset: (
    preset: StyleTransitionProps & ClassTransitionProps,
  ) => KineticComponent<Tag, Mode>
  enter: (styles: CSSProperties) => KineticComponent<Tag, Mode>
  enterTo: (styles: CSSProperties) => KineticComponent<Tag, Mode>
  enterTransition: (value: string) => KineticComponent<Tag, Mode>
  leave: (styles: CSSProperties) => KineticComponent<Tag, Mode>
  leaveTo: (styles: CSSProperties) => KineticComponent<Tag, Mode>
  leaveTransition: (value: string) => KineticComponent<Tag, Mode>
  enterClass: (opts: ClassConfig) => KineticComponent<Tag, Mode>
  leaveClass: (opts: ClassConfig) => KineticComponent<Tag, Mode>
  config: (opts: ConfigOpts<Mode>) => KineticComponent<Tag, Mode>
  on: (callbacks: Partial<TransitionCallbacks>) => KineticComponent<Tag, Mode>
  collapse: (opts?: {
    transition?: string
  }) => KineticComponent<Tag, 'collapse'>
  stagger: (opts?: {
    interval?: number
    reverseLeave?: boolean
  }) => KineticComponent<Tag, 'stagger'>
  group: () => KineticComponent<Tag, 'group'>
}

// ─── The full kinetic component: renderable + chainable ───

export type KineticComponent<
  Tag extends ElementType,
  Mode extends KineticMode = 'transition',
> = React.FC<KineticComponentProps<Tag, Mode>> & KineticChain<Tag, Mode>
