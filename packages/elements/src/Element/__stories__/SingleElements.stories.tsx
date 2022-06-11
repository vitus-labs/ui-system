import React from 'react'
import { config } from '@vitus-labs/core'
import Element from '~/Element'

export default {
  component: Element,
}

const extendCss = config.css`
  background-color: #fff;
  border: 1px solid black;
  color: black;
  padding: 16px 32px;
  font-size: 16px;
  margin: 4px 2px;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`

const beforeContent = ({ hover }) => <span>{hover ? 'normal' : 'hover'}</span>

export const Example = () => (
  <Element css={extendCss} beforeContent={beforeContent} afterContent="right">
    child
  </Element>
)

export const Input = () => (
  <Element tag="input" css={extendCss}>
    child
  </Element>
)

export const dangerouslySetInner = () => {
  const createMarkup = () => ({
    __html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.43895 4.93599C7.85368 5.52125 7.85368 6.47285 8.43895 7.05811L13.4252 12.0397L8.89355 16.9821C8.33141 17.5967 8.37776 18.5412 8.98279 19.1014L8.98505 19.1035C9.59965 19.6656 10.5442 19.6193 11.1044 19.0143L16.6061 13.0124L16.607 13.0114C17.1451 12.421 17.132 11.5069 16.5611 10.936L10.5611 4.93599C9.97579 4.35073 9.02421 4.35073 8.43895 4.93599Z" fill="currentColor"/>
</svg>
`,
  })

  return (
    <Element
      tag="span"
      css={extendCss}
      dangerouslySetInnerHTML={createMarkup()}
    />
  )
}
