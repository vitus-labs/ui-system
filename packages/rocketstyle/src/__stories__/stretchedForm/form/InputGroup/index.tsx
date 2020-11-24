import { element } from '../../base'

export default element
  .config({ name: 'base/form/InputGroup' })
  .attrs({
    tag: 'div',
    contentDirection: 'rows',
    beforeContentCss: (css) => css`
      ${({ theme: t }) => css`
        margin-right: ${t.marginPseudo}px;
      `};
    `,
    afterContentCss: (css) => css`
      ${({ theme: t }) => css`
        margin-left: ${t.marginPseudo}px;
      `};
    `,
  })
  .theme((t) => ({
    overflow: 'hidden',
    borderRadius: t.borderRadius.base,
    borderStyle: 'solid',
    borderWidth: t.borderWidth.base,
    borderColor: t.color.gray400,
    marginPseudo: t.spacing.sm,
  }))
