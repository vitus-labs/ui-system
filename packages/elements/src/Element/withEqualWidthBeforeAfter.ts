// @ts-nocheck
import { Component, createRef, createElement } from 'react'
import { throttle, get } from '@vitus-labs/core'

export default (WrappedComponent) =>
  class EqualWidth extends Component {
    static defaultProps = {
      throttleDelay: 50,
    }

    elementRef = createRef()

    componentDidMount() {
      const { openOn, closeOn, throttleDelay } = this.props
      this.mounted = true
      this.calculateSize()

      window.addEventListener(
        'resize',
        throttle(this.calculateSize, throttleDelay),
        false
      )
    }

    componentDidUpdate() {
      this.calculateSize()
    }

    componentWillUnmount() {
      const { throttleDelay } = this.props
      this.mounted = false

      window.removeEventListener('resize', this.calculateSize, false)
    }

    shouldCalculate = () => {
      const {
        equalBeforeAfter = true,
        beforeContent,
        afterContent,
      } = this.props

      if (equalBeforeAfter && beforeContent && afterContent) return true
      return false
    }

    calculateSize = () => {
      if (!this.shouldCalculate()) return

      const { vertical } = this.props
      const beforeContent = get(this.elementRef, 'current.children[0]')
      const afterContent = get(this.elementRef, 'current.children[2]')

      if (vertical) {
        const beforeContentHeight = beforeContent.offsetHeight
        const afterContentHeight = afterContent.offsetHeight

        if (beforeContentHeight > afterContentHeight) {
          beforeContent.style.height = `${beforeContentHeight}px`
          afterContent.style.height = `${beforeContentHeight}px`
        } else {
          beforeContent.style.height = `${afterContentHeight}px`
          afterContent.style.height = `${afterContentHeight}px`
        }
      } else {
        const beforeContentWidth = beforeContent.offsetWidth
        const afterContentWidth = afterContent.offsetWidth

        if (beforeContentWidth > afterContentWidth) {
          beforeContent.style.width = `${beforeContentWidth}px`
          afterContent.style.width = `${beforeContentWidth}px`
        } else {
          beforeContent.style.width = `${afterContentWidth}px`
          afterContent.style.width = `${afterContentWidth}px`
        }
      }
    }

    render() {
      return createElement(WrappedComponent, {
        ...this.props,
        ref: this.elementRef,
      })
    }
  }
