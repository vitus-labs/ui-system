import React from 'react'
import { init } from '~/init'
import Theme from '~/decorators/Theme'
import NormalComponent from './NormalComponent'

const storyOf = init({
  decorators: [Theme],
})

const stories = storyOf(NormalComponent)
  .controls({
    label: {
      type: 'text',
      description: 'Some label to be printed',
    },
  })
  .attrs({ label: 'Test' })

export default stories.init()

export const Example = stories.main()

// export const Custom = stories.render((props) => (
//   <NormalComponent {...props} label="Another" />
// ))

// export const CustomList = stories.list({
//   data: ['a', 'b', 'c', 'd'],
//   valueName: 'label',
// })

// export const CustomListObjects = stories.list({
//   data: [{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }],
// })
