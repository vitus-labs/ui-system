import { CONFIG, extendedCss } from '@vitus-labs/core'

export default CONFIG().styled(CONFIG().textComponent)`
  color: inherit;
  font-weight: normal;
  line-height: 1;

  ${({ extendCss }) => extendedCss(extendCss)};
`
