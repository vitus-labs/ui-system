/**
 * Default Storybook control definitions for Text-based components.
 * Provides controls for paragraph mode, HTML tag selection, children/label
 * content, and CSS extension.
 */
import { HTML_TAGS } from '@vitus-labs/core'

const group = 'Text (Vitus-Labs)'

export default {
  paragraph: {
    group,
    type: 'boolean',
    description:
      'Changes a behavior of inline text to become **block** text. Also changes HTML **tag** to `p`',
  },
  tag: {
    group,
    type: 'select',
    options: HTML_TAGS,
  },
  children: {
    group,
    type: '',
    valueType: 'ReactNode',
    description:
      'React children. Priorities when rendering are **children** → **label**, therefore _children_ has the highest priority.',
  },
  label: {
    group,
    type: 'text',
    valueType: 'ReactNode',
    description:
      'A prop which can be used instead of _children_. Priorities when rendering are **children** → **label**, therefore _label_ has lower priority than _children_.',
  },
  extendCss: {
    group,
    type: 'text',
    description:
      'An additional styling prop to enhance Text element CSS styles.',
  },
} as const
