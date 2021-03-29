import link from '../../Link'

const createState = color => ({
  base: {
    color
  }
})

const styles = css => css`
  &:focus,
  &:hover {
    text-decoration: none !important;
  }
`

export default link
  .config({
    name: 'Navigation.Item',
    consumer: ({ variant }) => ({ variant })
  })
  .styles(styles)
  .theme(t => ({
    paddingY: t.spacing.sm,
    paddingX: t.spacing.lg
  }))
  .variants((t, css) => ({
    tabs: {
      borderWidth: t.borderWidth,
      borderColor: t.color.transparent,
      active: {
        marginBottom: -1,
        color: t.color.gray700,
        paddingBottom: t.spacing.sm + 1,
        bgColor: t.color.white,
        extendCss: [
          css`
            border-color: ${t.color.gray300} ${t.color.gray300} ${t.color.white};
          `
        ]
      }
    },
    pills: {
      borderRadius: t.borderRadius.base,
      active: {
        color: t.color.white,
        bgColor: t.color.primary
      }
    }
  }))
