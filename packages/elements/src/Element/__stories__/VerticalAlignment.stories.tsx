import React, { Fragment } from 'react'
import { Wrapper, Inner } from './components'

storiesOf('ELEMENTS | Element', module).add('Vertical Alignment', () => {
  return (
    <Fragment>
      <Wrapper vertical block beforeContent={Inner} afterContent={Inner}>
        <Inner />
      </Wrapper>
      <Wrapper vertical block beforeContent={Inner} afterContent={Inner}>
        <Inner />
      </Wrapper>
      <Wrapper
        vertical
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
        vertical
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
        vertical
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
        vertical
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
        vertical
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
        vertical
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
        vertical
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
        vertical
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
        vertical
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
