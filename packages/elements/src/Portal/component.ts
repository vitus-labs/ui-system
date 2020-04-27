import { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Portal extends Component {
  static displayName = 'vitus-labs/elements/Portal'

  element = document.createElement('div')

  componentDidMount() {
    document.body.appendChild(this.element)
  }

  componentWillUnmount() {
    document.body.removeChild(this.element)
  }

  render() {
    const { children } = this.props
    return ReactDOM.createPortal(children, this.element)
  }
}
