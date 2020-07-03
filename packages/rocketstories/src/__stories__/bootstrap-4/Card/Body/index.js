import element from '../base'

const styles = css => css`
  flex: 1 1 auto;
`

export default element
  .config({
    name: 'Card.Body'
  })
  .styles(styles)
  .attrs({
    contentDirection: 'rows'
  })
  .theme(t => ({
    paddingY: t.spacing.xl,
    paddingX: t.spacing.xl
  }))
