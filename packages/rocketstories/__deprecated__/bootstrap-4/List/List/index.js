import { list } from '../../base'
import ListItem from '../ListItem'

const styles = css => css`
  ${({ vertical }) =>
    vertical
      ? css`
          & > * {
            margin-bottom: -1px;
          }
        `
      : css`
          & > * {
            margin-left: -1px;
          }
        `};
`

export default list
  .config({
    name: 'bootstrap-4/List',
    provider: true
  })
  .styles(styles)
  .attrs({
    vertical: true,
    contentAlignX: 'block',
    tag: 'ul',
    component: ListItem
  })
  .theme(t => ({
    paddingLeft: t.spacing.reset,
    marginY: t.spacing.reset
  }))
  .variants({
    flush: true
  })
