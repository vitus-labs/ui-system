import type { CSSProperties, ReactElement } from 'react'

/** Internal lifecycle stages of a transition. */
export type TransitionStage = 'hidden' | 'entering' | 'entered' | 'leaving'

/** Class-based transition definition. */
export type ClassTransitionProps = {
  /** Classes applied during the entire enter phase */
  enter?: string
  /** Classes applied on first frame of enter, removed on next frame */
  enterFrom?: string
  /** Classes applied on second frame of enter, kept until complete */
  enterTo?: string
  /** Classes applied during the entire leave phase */
  leave?: string
  /** Classes applied on first frame of leave */
  leaveFrom?: string
  /** Classes applied on second frame of leave, kept until complete */
  leaveTo?: string
}

/** Style-object transition definition (zero-CSS option). */
export type StyleTransitionProps = {
  /** Inline styles for the start of enter */
  enterStyle?: CSSProperties
  /** Inline styles for the end of enter */
  enterToStyle?: CSSProperties
  /** CSS transition shorthand applied during enter */
  enterTransition?: string
  /** Inline styles for the start of leave */
  leaveStyle?: CSSProperties
  /** Inline styles for the end of leave */
  leaveToStyle?: CSSProperties
  /** CSS transition shorthand applied during leave */
  leaveTransition?: string
}

/** Lifecycle callbacks. */
export type TransitionCallbacks = {
  /** Called immediately when entering begins */
  onEnter?: () => void
  /** Called when enter animation completes */
  onAfterEnter?: () => void
  /** Called immediately when leaving begins */
  onLeave?: () => void
  /** Called when leave animation completes */
  onAfterLeave?: () => void
}

export type TransitionProps = ClassTransitionProps &
  StyleTransitionProps &
  TransitionCallbacks & {
    /** Controls visibility. true = enter, false = leave + unmount. */
    show: boolean
    /** If true, runs enter animation on initial mount. Default: false. */
    appear?: boolean
    /** If true (default), unmounts when hidden. If false, keeps with display:none. */
    unmount?: boolean
    /** Safety timeout in ms. Default: 5000. */
    timeout?: number
    /** Single child element. Must accept className, style, and ref. */
    children: ReactElement
  }

export type TransitionGroupProps = ClassTransitionProps &
  StyleTransitionProps &
  TransitionCallbacks & {
    /** If true, animates initial children on mount. Default: false. */
    appear?: boolean
    /** Safety timeout in ms. Default: 5000. */
    timeout?: number
    /** Children with unique keys. */
    children: ReactElement[]
  }

export type StaggerProps = ClassTransitionProps &
  StyleTransitionProps &
  TransitionCallbacks & {
    /** Controls visibility of all children. */
    show: boolean
    /** Delay between each child's animation start in ms. Default: 50. */
    interval?: number
    /** If true, reverses stagger order on leave. Default: false. */
    reverseLeave?: boolean
    /** If true, animates on initial mount. Default: false. */
    appear?: boolean
    /** Safety timeout in ms. Default: 5000. */
    timeout?: number
    /** Children to stagger. */
    children: ReactElement[]
  }

export type CollapseProps = TransitionCallbacks & {
  /** Controls expanded/collapsed state. */
  show: boolean
  /** CSS transition for height. Default: "height 300ms ease". */
  transition?: string
  /** If true, animates on initial mount. Default: false. */
  appear?: boolean
  /** Safety timeout in ms. Default: 5000. */
  timeout?: number
  /** The content to collapse. */
  children: ReactElement
}

export type TransitionStateResult = {
  /** Current lifecycle stage */
  stage: TransitionStage
  /** Ref to attach to the transitioning element */
  ref: React.RefObject<HTMLElement | null>
  /** Whether the element should be rendered */
  shouldMount: boolean
  /** Call when the current animation finishes */
  complete: () => void
}
