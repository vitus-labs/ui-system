import navigation from '../../Navigation'

export default navigation
  .config({
    name: 'Card.Navigation'
  })
  .theme(t => ({
    marginX: t.spacing.sm * -1
  }))
  .variants(t => ({
    tabs: {
      marginBottom: t.spacing.base * -1,
      borderBottom: t.spacing.reset
    }
  }))
