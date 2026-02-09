/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */

import { compose, hoistNonReactStatics, omit, pick } from '@vitus-labs/core'
import { forwardRef, useMemo } from 'react'
import { attrsHoc } from '~/hoc'
import { useRef } from '~/hooks'
import type {
  AttrsComponent as AttrsComponentType,
  ExoticComponent,
  InnerComponentProps,
} from '~/types/AttrsComponent'
import type {
  Configuration,
  ExtendedConfiguration,
} from '~/types/configuration'
import type { InitAttrsComponent } from '~/types/InitAttrsComponent'
import { calculateChainOptions } from '~/utils/attrs'
import { chainOptions } from '~/utils/chaining'
import { calculateHocsFuncs } from '~/utils/compose'
import { createStaticsEnhancers } from '~/utils/statics'

/**
 * Clones the current configuration and merges new options, then creates a
 * fresh component. This makes the chaining API immutable — each `.attrs()`
 * / `.config()` / `.statics()` call returns a brand-new component with an
 * updated configuration rather than mutating the existing one.
 */
type CloneAndEnhance = (
  defaultOpts: Configuration,
  opts: Partial<ExtendedConfiguration>,
) => ReturnType<typeof attrsComponent>

const cloneAndEnhance: CloneAndEnhance = (defaultOpts, opts) =>
  // @ts-expect-error
  attrsComponent({
    ...defaultOpts,
    ...(opts.name ? { name: opts.name } : undefined),
    ...(opts.component ? { component: opts.component } : undefined),
    attrs: chainOptions(opts.attrs, defaultOpts.attrs),
    filterAttrs: [
      ...(defaultOpts.filterAttrs ?? []),
      ...(opts.filterAttrs ?? []),
    ],
    priorityAttrs: chainOptions(opts.priorityAttrs, defaultOpts.priorityAttrs),
    statics: { ...defaultOpts.statics, ...opts.statics },
    compose: { ...defaultOpts.compose, ...opts.compose },
  })

/**
 * Core factory that builds an attrs-enhanced React component.
 *
 * Creates a `forwardRef` component that:
 * 1. Wraps the original with attrsHoc (default props) + user HOCs from `.compose()`.
 * 2. Manages ref forwarding through the HOC chain via `$attrsRef`.
 * 3. Filters out internal props listed in `filterAttrs`.
 * 4. Attaches `data-attrs` attribute in development for debugging.
 *
 * Then adds chaining methods (`.attrs()`, `.config()`, `.compose()`, `.statics()`)
 * as static properties — each calls `cloneAndEnhance` to produce a new component.
 */
const attrsComponent: InitAttrsComponent = (options) => {
  const componentName =
    options.name ?? options.component.displayName ?? options.component.name

  const RenderComponent = options.component

  // Build the HOC chain: attrsHoc is always first (resolves default props),
  // followed by user-composed HOCs in reverse order (outermost wraps first).
  const hocsFuncs = [attrsHoc(options), ...calculateHocsFuncs(options.compose)]

  // The inner component receives already-computed props from the HOC chain.
  // It handles ref merging, prop filtering, and final rendering.
  // eslint-disable-next-line react/display-name
  const EnhancedComponent: ExoticComponent<InnerComponentProps> = forwardRef(
    (
      {
        $attrsRef, // consumer's original ref, forwarded through attrsHoc
        ...props
      },
      ref, // ref from any intermediate HOC in the compose chain
    ) => {
      // Merge both ref sources into a single internal ref so that
      // both the consumer's ref and intermediate HOC refs point to the same node.
      const internalRef = useRef({ $attrsRef, ref })
      const needsRef = ref ?? $attrsRef
      const needsFiltering =
        options.filterAttrs && options.filterAttrs.length > 0

      const finalProps = useMemo(() => {
        // Only create new object if ref needs to be added
        const baseProps = needsRef ? { ...props, ref: internalRef } : props

        // Only filter if there are props to filter
        const filteredProps = needsFiltering
          ? omit(baseProps, options.filterAttrs)
          : baseProps

        // Add dev-only data attribute
        if (process.env.NODE_ENV !== 'production') {
          return { ...filteredProps, 'data-attrs': componentName }
        }

        return filteredProps
      }, [props, needsRef, internalRef, needsFiltering])

      return <RenderComponent {...finalProps} />
    },
  )

  // Apply the full HOC chain: compose(attrsHoc, ...userHocs)(EnhancedComponent)
  const AttrsComponent: AttrsComponentType = compose(...hocsFuncs)(
    EnhancedComponent,
  )

  AttrsComponent.IS_ATTRS = true
  AttrsComponent.displayName = componentName
  AttrsComponent.meta = {}

  // Copy static properties from the original component (e.g. propTypes).
  hoistNonReactStatics(AttrsComponent, options.component)

  // Populate `component.meta` with user-defined statics from `.statics()`.
  createStaticsEnhancers({
    context: AttrsComponent.meta,
    options: options.statics,
  })

  // ─── Chaining Methods ──────────────────────────────────
  // Each method creates a new component via cloneAndEnhance.
  // The original component is never mutated.

  // @ts-expect-error
  AttrsComponent.attrs = (attrs, { priority, filter } = {}) => {
    const result: Record<string, any> = {}

    if (filter) {
      result.filterAttrs = filter
    }

    if (priority) {
      result.priorityAttrs = attrs as ExtendedConfiguration['priorityAttrs']

      return cloneAndEnhance(options, result)
    }

    result.attrs = attrs as ExtendedConfiguration['attrs']

    return cloneAndEnhance(options, result)
  }

  // @ts-expect-error
  AttrsComponent.config = (opts = {}) => {
    const result = pick(opts)

    return cloneAndEnhance(options, result)
  }

  AttrsComponent.compose = (opts) =>
    // @ts-expect-error
    cloneAndEnhance(options, { compose: opts })

  AttrsComponent.statics = (opts) =>
    // @ts-expect-error
    cloneAndEnhance(options, { statics: opts })

  AttrsComponent.getDefaultAttrs = (props) =>
    calculateChainOptions(options.attrs)([props])

  return AttrsComponent
}

export default attrsComponent
