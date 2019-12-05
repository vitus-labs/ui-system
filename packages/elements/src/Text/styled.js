import { CONFIG } from '@vitus-labs/core'
import { extendedCss } from '@vitus-labs/unistyle'

export default CONFIG().styled(CONFIG().textComponent)`
  color: inherit;
  font-weight: normal;
  line-height: 1;

  ${({ extendCss }) => extendedCss(extendCss)};
`
