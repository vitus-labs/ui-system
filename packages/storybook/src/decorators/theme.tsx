import React from 'react'
import { Provider } from '@vitus-labs/unistyle'

import { init } from '@vitus-labs/core'

if (__VITUS_LABS_STORIES__.styles === 'styled-components') {
  const styled = require('styled-components')

  init({
    styled: styled.default,
    css: styled.css,
    context: styled.ThemeContext,
  })
}

export default (theme) => (Story) => (
  <Provider theme={theme}>
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        // @ts-ignore
        __html: `@import url(${__VITUS_LABS_STORIES__.font});`,
      }}
    />
    <Story />
  </Provider>
)
