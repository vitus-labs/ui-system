import React from 'react'
import theme from '../themeDecorator'
import Text from '.'

export default {
  component: Text,
  title: 'Text',
}

export const examples = () => (
  <>
    <Text>
      Traditional heading elements are designed to work best in the meat of your
      page content. When you need a heading to stand out, consider using a
      display heading—a larger, slightly more opinionated heading style.
    </Text>

    <Text lead>
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
      Duis mollis, est non commodo luctus.
    </Text>
  </>
)

export const inlineTextElements = () => (
  <>
    <Text>
      You can use the mark tag to <Text highlight>highlight</Text> text.
    </Text>

    <Text>
      <Text deleted>
        This line of text is meant to be treated as deleted text.
      </Text>
    </Text>

    <Text>
      <Text replaced>
        This line of text is meant to be treated as no longer accurate.
      </Text>
    </Text>

    <Text>
      <Text inserted>
        This line of text is meant to be treated as an addition to the document.
      </Text>
    </Text>

    <Text>
      <Text underlined>This line of text will render as underlined</Text>
    </Text>

    <Text>
      <Text small>This line of text is meant to be treated as fine print.</Text>
    </Text>

    <Text>
      <Text strong>This line rendered as bold text.</Text>
    </Text>

    <Text>
      <Text italic>This line rendered as italicized text.</Text>
    </Text>

    <Text>
      <Text abbr title="attribute">
        attr
      </Text>
    </Text>
  </>
)

export const textAlignment = () => (
  <>
    <Text left>Left aligned text on all viewport sizes.</Text>
    <Text centered>Center aligned text on all viewport sizes.</Text>
    <Text right>Right aligned text on all viewport sizes.</Text>
    <Text justified>
      Ambitioni dedisse scripsisse iudicaretur. Cras mattis iudicium purus sit
      amet fermentum. Donec sed odio operae, eu vulputate felis rhoncus.
      Praeterea iter est quasdam res quas ex communi. At nos hinc posthac,
      sitientis piros Afros. Petierunt uti sibi concilium totius Galliae in diem
      certam indicere. Cras mattis iudicium purus sit amet fermentum.
    </Text>
  </>
)

export const textTransform = () => (
  <>
    <Text lowercase>Lowercased text.</Text>
    <Text uppercase>Uppercased text.</Text>
    <Text capitalize>CapiTaliZed text.</Text>
  </>
)

export const fontWeightAnditalics = () => (
  <>
    <Text bold>Bold text.</Text>
    <Text normal>Normal weight text.</Text>
    <Text thin>Thin weight text.</Text>
    <Text italic>Italic text.</Text>
  </>
)

export const monospace = () => <Text monospace>This is in monospace</Text>

export const nesting = () => (
  <>
    <Text>
      Traditional heading <Text>elements</Text> are <Text strong>designed</Text>{' '}
      to work best in the meat of your page content. When you need a heading to
      stand out, consider using a display heading—a larger, slightly more
      opinionated heading style.
    </Text>

    <Text lead>
      Vivamus <Text>sagittis</Text> lacus vel <Text italic>augue</Text> laoreet
      rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.
    </Text>
  </>
)
