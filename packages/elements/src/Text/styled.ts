import { config } from '@vitus-labs/core'
import { extendedCss } from '@vitus-labs/unistyle'

export default config.styled(config.textComponent)`
  color: inherit;
  font-weight: normal;
  line-height: 1;

  ${({ extendCss }) => extendedCss(extendCss)};
`
