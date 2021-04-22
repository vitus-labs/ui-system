import { htmlTags } from '@vitus-labs/core'

export default {
  paragraph: {
    type: 'boolean',
    group: 'Text',
  },
  tag: {
    type: 'select',
    options: htmlTags,
    group: 'Text',
  },
  children: {
    type: 'text',
    group: 'Text',
  },
  label: {
    type: 'text',
    group: 'Text',
  },
  extendCss: {
    type: 'text',
    group: 'Text',
  },
} as const
