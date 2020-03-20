import { rgba } from 'polished'
import base from '../base'

// FIXME: use value from core
const styles = css => css`
  min-width: 0;
  word-wrap: break-word;
  background-clip: border-box;

  & > hr {
    margin-right: 0;
    margin-left: 0;
  }

  & a + a,
  & button + button {
    margin-left: 1.25rem;
  }
`

export default base
  .config({
    name: 'bootstrap-4/Card'
  })
  .attrs({
    contentAlignX: 'block'
  })
  .styles(styles)
  .theme(t => ({
    bgColor: t.color.white,
    borderWidth: t.borderWidth,
    borderStyle: 'solid',
    borderColor: rgba(t.color.black, 0.125),
    borderRadius: t.borderRadius.base,
    separatorSpacing: t.spacing.reset,
    siblingsSpacing: t.spacing.base
  }))
