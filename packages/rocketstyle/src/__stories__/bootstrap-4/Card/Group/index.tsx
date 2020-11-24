import { list } from '../../base'

export default list
  .config({
    name: 'Card.Group',
  })
  .attrs({
    contentAlignY: 'top',
  })
  .styles(
    (css) => css`
      align-items: stretch;
    `
  )
  .variants((_, css) => ({
    columns: {
      display: 'block',
      extendCss: css`
        column-count: 3;
        column-gap: 1.25rem;
        orphans: 1;
        widows: 1;

        & > * {
          display: inline-block;
        }
      `,
    },
  }))
