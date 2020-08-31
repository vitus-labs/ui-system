import React from 'react'
import Element, { withEqualSizeBeforeAfter } from '~/Element'
import { Wrapper, Inner } from './components'

const NewElement = withEqualSizeBeforeAfter(Element)

//   < NewElement
// block
// equalBeforeAfter
// beforeContent = { Inner }
// afterContent = { Inner }
//   >
//   <Inner />
//       </NewElement >

storiesOf('ELEMENTS | Element', module).add('Alignment', () => {
  return (
    <Fragment>
      {/* <Element block beforeContent={Inner} afterContent={Inner} /> */}
      {/* <NewElement
        beforeContent={
          <>
            <Inner />
            <Inner />
            <Inner />
            <Inner />
            <Inner />
            <Inner />
          </>
        }
        afterContent={Inner}
      >
        some content
      </NewElement> */}
      <Wrapper block={false} beforeContent={Inner} afterContent={Inner}>
        <Inner />
      </Wrapper>
      <Wrapper block beforeContent={Inner} afterContent={Inner}>
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignY="top"
        contentAlignY="top"
        afterContentAlignY="top"
      >
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignY="bottom"
        contentAlignY="bottom"
        afterContentAlignY="bottom"
      >
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignY="top"
        contentAlignY="center"
        afterContentAlignY="bottom"
      >
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignY="bottom"
        contentAlignY="center"
        afterContentAlignY="top"
      >
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignX="left"
        contentAlignX="left"
        afterContentAlignX="left"
      >
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignX="center"
        contentAlignX="center"
        afterContentAlignX="center"
      >
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignX="right"
        contentAlignX="right"
        afterContentAlignX="right"
      >
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignX="left"
        contentAlignX="center"
        afterContentAlignX="right"
      >
        <Inner />
      </Wrapper>
      <Wrapper
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignX="right"
        contentAlignX="center"
        afterContentAlignX="left"
      >
        <Inner />
      </Wrapper>
    </Fragment>
  )
})
