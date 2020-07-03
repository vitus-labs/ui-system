import { list } from '../../base'
import Button from '../../Button'

export default list
  .config({
    name: 'bootstrap-4/ButtonGroup'
  })
  .attrs({
    component: Button,
    role: 'group',
    'aria-label': 'Button group',
    passProps: [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
      'link',
      'sm',
      'lg',
      'rounded',
      'outline'
    ]
  })
  .styles(
    css => css`
      align-items: stretch;
    `
  )
