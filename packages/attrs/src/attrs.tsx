/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import React, { forwardRef } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { pick, compose } from '@vitus-labs/core'
import { useRef } from '~/hooks'
import { attrsHoc } from '~/hoc'
import { createStaticsEnhancers } from '~/utils/statics'
import { chainOptions } from '~/utils/chaining'
import { calculateHocsFuncs } from '~/utils/compose'
import { calculateChainOptions } from '~/utils/attrs'
import type {
  AttrsComponent,
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
// always returns rocketComponent with static functions
// assigned
// --------------------------------------------------------
type CloneAndEnhance = (
  defaultOpts: Configuration,
  opts: Partial<ExtendedConfiguration>,
) => ReturnType<typeof rocketComponent>

const cloneAndEnhance: CloneAndEnhance = (defaultOpts, opts) =>
  // @ts-ignore
  rocketComponent({
    ...defaultOpts,
    attrs: chainOptions(opts.attrs, defaultOpts.attrs),
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
const rocketComponent: InitAttrsComponent = (options) => {
  const componentName =
    options.name || options.component.displayName || options.component.name

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
      // (1) one is passed from inner HOC - $rocketstyleRef
      // (2) second one is used to be used directly (e.g. inside hocs)
      // --------------------------------------------------
      const internalRef = useRef({ $attrsRef, ref })

      // --------------------------------------------------
      // final props
      // final props passed to WrappedComponent
      // excluding: styling props
      // including: $rocketstyle, $rocketstate
      // --------------------------------------------------
      const finalProps: Record<string, any> = {
        // this removes styling state from props and passes its state
        // under rocketstate key only
        ...props,
        ref: ref || $attrsRef ? internalRef : undefined,
      }

      // all the development stuff injected
      if (process.env.NODE_ENV !== 'production') {
        finalProps['data-attrs'] = componentName
      }

      return <RenderComponent {...finalProps} />
    },
  )

  // ------------------------------------------------------
  // This will hoist and generate dynamically next static methods
  // for all dimensions available in configuration
  // ------------------------------------------------------
  const RocketComponent: AttrsComponent = compose(...hocsFuncs)(
    EnhancedComponent,
  )

  RocketComponent.IS_ATTRS = true
  RocketComponent.displayName = componentName

  hoistNonReactStatics(RocketComponent, options.component)

  // ------------------------------------------------------
  RocketComponent.IS_ATTRS = true
  RocketComponent.displayName = componentName
  RocketComponent.meta = {}
  // ------------------------------------------------------

  // ------------------------------------------------------
  // enhance for statics
  // ------------------------------------------------------
  createStaticsEnhancers({
    context: RocketComponent.meta,
    options: options.statics,
  })

  // @ts-ignore
  RocketComponent.attrs = (attrs, { priority } = {}) => {
    if (priority) {
      return cloneAndEnhance(options, {
        priorityAttrs: attrs as ExtendedConfiguration['attrs'],
      })
    }

    return cloneAndEnhance(options, {
      attrs: attrs as ExtendedConfiguration['attrs'],
    })
  }

  // @ts-ignore
  RocketComponent.config = (opts = {}) => {
    const result = pick(opts)

    return cloneAndEnhance(options, result)
  }

  // @ts-ignore
  RocketComponent.statics = (opts) =>
    // @ts-ignore
    cloneAndEnhance(options, { statics: opts })

  RocketComponent.getDefaultAttrs = (props) =>
    calculateChainOptions(options.attrs)([props])

  return RocketComponent
}

export default rocketComponent
