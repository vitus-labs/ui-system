import React from 'react'
import { Provider } from '@vitus-labs/unistyle'

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
