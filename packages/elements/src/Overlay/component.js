import React, { Component, createRef } from 'react'
import config, { renderContent, throttle } from '@vitus-labs/core'
import { stripUnit, value } from '@vitus-labs/unistyle'
import Portal from '~/Portal'
import Util from '~/Util'

const Utility = config.styled(Util)`
  ${({ overlay: t }) => config.css`
    position: ${t.position};
    top: ${value({ param: t.top })};
    bottom: ${value({ param: t.bottom })};
    left: ${value({ param: t.left })};
    right: ${value({ param: t.right })};
    transform: ${t.transformX} ${t.transformY};
  `};
`

export default class Overlay extends Component {
  static displayName = 'vitus-labs/elements/Overlay'
  static defaultProps = {
    refName: 'ref',
    openOn: 'click', // click | hover
    closeOn: 'click', // click | triggerClick | hover | manual
    type: 'dropdown', // dropdown | tooltip | popover | modal
    align: 'bottom', // * main align prop * top | left | bottom | right
    position: 'absolute', // absolute | fixed | relative | static
    alignX: 'left', // left | center | right
    alignY: 'bottom', // top | center | bottom
    offsetX: 0,
    offsetY: 0,
    throttleDelay: 200
  }

  state = {
    visible: false,
    theme: {}
  }

  trigger = createRef()
  content = createRef()

  componentDidMount() {
    const { openOn, closeOn, throttleDelay } = this.props
    this.mounted = true

    if (openOn === 'click' || closeOn === 'click' || closeOn === 'triggerClick') {
      window.addEventListener('click', this.handleDocumentClick, false)
      window.addEventListener('touchend', this.handleDocumentClick, false)
    }

    if (openOn === 'hover' || closeOn === 'hover') {
      window.addEventListener(
        'mousemove',
        throttle(this.handleDocumentClick, throttleDelay),
        false
      )
    }
  }

  componentWillUnmount() {
    const { throttleDelay } = this.props
    this.mounted = false
    window.removeEventListener('click', this.handleDocumentClick, false)
    window.removeEventListener('touchend', this.handleDocumentClick, false)
    window.removeEventListener(
      'mousemove',
      throttle(this.handleDocumentClick, throttleDelay),
      false
    )
  }

  observeTrigger = e => {
    if (e && e.target && this.trigger.current) {
      return (
        this.trigger.current.contains(e.target) || e.target === this.trigger.current
      )
    }

    return false
  }

  observeHoverElement = e => {
    if (e && e.target && this.content.current) {
      return (
        this.content.current.contains(e.target) || e.target === this.content.current
      )
    }

    return false
  }

  handleDocumentClick = e => {
    const { openOn, closeOn } = this.props
    const { visible } = this.state

    if (!visible) {
      if (openOn === 'hover' && e.type === 'mousemove') {
        if (this.observeTrigger(e)) {
          this.showContent()
        }
      }

      if (openOn === 'click' && e.type === 'click') {
        if (this.observeTrigger(e)) {
          this.showContent()
        }
      }
    }

    if (visible) {
      if (closeOn === 'hover' && e.type === 'mousemove') {
        if (!this.observeTrigger(e) && !this.observeHoverElement(e)) {
          this.hideContent()
        }
      }

      if (closeOn === 'click' && e.type === 'click') {
        this.hideContent()
      }

      if (closeOn === 'triggerClick' && e.type === 'click') {
        if (this.observeTrigger(e)) {
          this.hideContent()
        }
      }
    }
  }

  calculateContentPosition = () => {
    const { type, align, alignX, alignY, offsetX, offsetY, position } = this.props

    const dimensions = this.trigger.current.getBoundingClientRect()

    const theme = { position }

    if (type === 'dropdown' || type === 'tooltip' || type === 'popover') {
      if (align === 'top' || align === 'bottom') {
        if (align === 'top') {
          theme.top = dimensions.top + offsetY + window.scrollY
          theme.transformY = 'translateY(-100%)'
        } else {
          theme.top = dimensions.bottom + offsetY + window.scrollY
        }

        switch (alignX) {
          case 'right':
            theme.left = dimensions.right + offsetX + window.scrollX
            theme.transformX = 'translateX(-100%)'
            break
          case 'center':
            theme.left =
              dimensions.left +
              (dimensions.right - dimensions.left) / 2 +
              window.scrollX
            theme.transformX = 'translateX(-50%)'
            break
          case 'bottom':
          default:
            theme.left = dimensions.left - offsetX + window.scrollX
        }
      } else if (align === 'left' || align === 'right') {
        if (align === 'left') {
          theme.left = dimensions.left - offsetX + window.scrollX
          theme.transformX = 'translateX(-100%)'
        } else {
          theme.left = dimensions.right + offsetX + window.scrollX
        }
        switch (alignY) {
          case 'top':
            theme.top = dimensions.top - offsetY + window.scrollY
            break
          case 'center':
            theme.top =
              dimensions.top +
              (dimensions.bottom - dimensions.top) / 2 +
              window.scrollY
            theme.transformY = 'translateY(-50%)'
            break
          default:
            theme.top = dimensions.bottom + offsetY + window.scrollY
        }
      }
    } else if (type === 'modal') {
      switch (alignX) {
        case 'right':
          theme.right = offsetX
          // theme.transform = 'translateX(-100%)'
          break
        case 'left':
          theme.left = offsetX
        case 'center':
        default:
          theme.left = '50%'
          theme.transformX = 'translateX(-50%)'
          break
      }
      switch (alignY) {
        case 'top':
          theme.top = offsetY
          break
        case 'center':
          theme.top = '50%'
          theme.transformY = 'translateY(-50%)'
          break
        case 'bottom':
        default:
          theme.bottom = offsetY
          break
      }
    }

    this.setState({
      theme
    })
  }

  showContent = () => {
    const { type } = this.props
    this.setState({
      visible: true
    })

    this.calculateContentPosition()

    if (type === 'modal' && document.body) {
      document.body.style.overflow = 'hidden'
    }
  }

  hideContent = () => {
    const { type } = this.props
    this.setState({ visible: false })

    if (type === 'modal' && document.body) {
      document.body.style.overflow = 'auto'
    }
  }

  render() {
    const { refName, trigger, alignX, alignY, children } = this.props

    return (
      <>
        {renderContent(trigger, {
          [refName]: this.trigger
        })}

        {this.state.visible && (
          <Portal>
            <Utility overlay={this.state.theme}>
              {renderContent(children, {
                [refName]: this.content,
                alignX,
                alignY,
                showContent: this.showContent,
                hideContent: this.hideContent
              })}
            </Utility>
          </Portal>
        )}
      </>
    )
  }
}
