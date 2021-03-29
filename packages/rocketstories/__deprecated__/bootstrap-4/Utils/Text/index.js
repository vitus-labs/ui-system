import { utility } from '../../base'
import text from '../../Text'

export default text.config({
  name: 'Utils.Text',
  component: utility,
  styles: css => css`
    ${({ rocketstyle: t }) => {
      return css`
        && {
          font-size: ${t.fontSize};
          font-weight: ${t.fontWeight};
          text-align: ${t.textAlign};
          color: ${t.color};
          text-transform: ${t.textTransform};
          text-decoration: ${t.textDecoration};
          font-style: ${t.fontStyle};
          white-space: ${t.whiteSpace};
          ${t.extendCss};
        }
      `
    }};
  `
})
