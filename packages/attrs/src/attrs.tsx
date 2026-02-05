/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import React, { forwardRef, useMemo } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { pick, compose, omit } from '@vitus-labs/core'
import { useRef } from '~/hooks'
import { attrsHoc } from '~/hoc'
import { createStaticsEnhancers } from '~/utils/statics'
import { chainOptions } from '~/utils/chaining'
import { calculateHocsFuncs } from '~/utils/compose'
import { calculateChainOptions } from '~/utils/attrs'
import type {
  AttrsComponent as AttrsComponentType,
  ExoticComponent,
  InnerComponentProps,
} from '~/types/AttrsComponent'
import type { InitAttrsComponent } from '~/types/InitAttrsComponent'
import type {
  Configuration,
  ExtendedConfiguration,
} from '~/types/configuration'

// --------------------------------------------------------
// cloneAndEnhance
// helper function which allows function chaining
// always returns attrsComponent with static functions
// assigned
// --------------------------------------------------------
type CloneAndEnhance = (
  defaultOpts: Configuration,
  opts: Partial<ExtendedConfiguration>,
) => ReturnType<typeof attrsComponent>

const cloneAndEnhance: CloneAndEnhance = (defaultOpts, opts) =>
  // @ts-ignore
  attrsComponent({
    ...defaultOpts,
    attrs: chainOptions(opts.attrs, defaultOpts.attrs),
    filterAttrs: [
      ...(defaultOpts.filterAttrs ?? []),
      ...(opts.filterAttrs ?? []),
    ],
    priorityAttrs: chainOptions(opts.priorityAttrs, defaultOpts.priorityAttrs),
    statics: { ...defaultOpts.statics, ...opts.statics },
    compose: { ...defaultOpts.compose, ...opts.compose },
  })

// --------------------------------------------------------
// styleComponent
// helper function which allows function chaining
// always returns a valid React component with static functions
// assigned, so it can be even rendered as a valid component
// or styles can be extended via its statics
// --------------------------------------------------------
// @ts-ignore
const attrsComponent: InitAttrsComponent = (options) => {
  const componentName =
    options.name ?? options.component.displayName ?? options.component.name

  // --------------------------------------------------------
  // COMPONENT - Final component to be rendered
  // --------------------------------------------------------
  const RenderComponent = options.component

  // --------------------------------------------------------
  // COMPOSE - high-order components
  // --------------------------------------------------------
  const hocsFuncs = [attrsHoc(options), ...calculateHocsFuncs(options.compose)]

  // --------------------------------------------------------
  // ENHANCED COMPONENT (returned component)
  // --------------------------------------------------------
  // .attrs() chaining option is calculated in HOC and passed as props already
  // eslint-disable-next-line react/display-name
  const EnhancedComponent: ExoticComponent<InnerComponentProps> = forwardRef(
    (
      {
        $attrsRef, // it's forwarded from HOC which is always on top of all hocs
        ...props
      },
      ref,
    ) => {
      // --------------------------------------------------
      // handle refs
      // (1) one is passed from inner HOC - $attrsStyleRef
      // (2) second one is used to be used directly (e.g. inside hocs)
      // --------------------------------------------------
      const internalRef = useRef({ $attrsRef, ref })

      // --------------------------------------------------
      // final props
      // final props passed to WrappedComponent
      // excluding: styling props
      // including: $attrsStyle, $attrsState
      // --------------------------------------------------
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
      }, [props, needsRef, internalRef])

      return <RenderComponent {...finalProps} />
    },
  )

  // ------------------------------------------------------
  // This will hoist and generate dynamically next static methods
  // for all dimensions available in configuration
  // ------------------------------------------------------
  const AttrsComponent: AttrsComponentType = compose(...hocsFuncs)(
    EnhancedComponent,
  )

  AttrsComponent.IS_ATTRS = true
  AttrsComponent.displayName = componentName
  AttrsComponent.meta = {}

  hoistNonReactStatics(AttrsComponent, options.component)

  // ------------------------------------------------------
  // enhance for statics
  // ------------------------------------------------------
  createStaticsEnhancers({
    context: AttrsComponent.meta,
    options: options.statics,
  })

  // @ts-ignore
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

  // @ts-ignore
  AttrsComponent.config = (opts = {}) => {
    const result = pick(opts)

    return cloneAndEnhance(options, result)
  }

  // @ts-ignore
  AttrsComponent.statics = (opts) =>
    // @ts-ignore
    cloneAndEnhance(options, { statics: opts })

  AttrsComponent.getDefaultAttrs = (props) =>
    calculateChainOptions(options.attrs)([props])

  return AttrsComponent
}

export default attrsComponent
