import { list } from '../../base'
import NavigationItem from '../NavigationItem'
import { borderWidth } from 'polished'

export default list
  .config({
    name: 'bootstrap-4/Navigation',
    provider: true
  })
  .styles(
    css => css`
      list-style: none;
    `
  )
  .attrs({
    tag: 'nav',
    block: true,
    component: NavigationItem,
    passProps: ['disabled', 'active'],
    useExtendedStyles: false
  })
  .theme(t => ({
    marginBottom: t.spacing.reset,
    paddingLeft: t.spacing.reset
  }))
  .variants((t, css) => ({
    pills: true,
    tabs: {
      borderWidth: t.borderWidth,
      borderColor: t.color.gray300,
      borderSide: 'bottom'
    }
  }))
