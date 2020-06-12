import { config } from '@vitus-labs/core'
import { value } from '@vitus-labs/unistyle'
import Util from '~/Util'

export default config.styled(Util)`
  ${({ theme, $overlay: t }) => config.css`
    position: ${t.position};
    top: ${value(theme.rootSize, [t.top])};
    bottom: ${value(theme.rootSize, [t.bottom])};
    left: ${value(theme.rootSize, [t.left])};
    right: ${value(theme.rootSize, [t.right])};
    transform: ${t.transformX} ${t.transformY};
  `};
`
