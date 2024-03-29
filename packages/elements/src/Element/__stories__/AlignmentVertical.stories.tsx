import React from 'react'
import Element from '~/Element'
import { Wrapper, Inner } from './base'

const meta = {
  component: Element,
}

export default meta

export const VerticalElement = {
  render: () => (
    <>
      <Wrapper
        direction="rows"
        block
        beforeContent={Inner}
        afterContent={Inner}
      >
        <Inner />
      </Wrapper>
      <Wrapper
        direction="rows"
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
        direction="rows"
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
        direction="rows"
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
        direction="rows"
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
        direction="rows"
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
        direction="rows"
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
        direction="rows"
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
        direction="rows"
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
        direction="rows"
        block
        beforeContent={Inner}
        afterContent={Inner}
        beforeContentAlignX="right"
        contentAlignX="center"
        afterContentAlignX="left"
      >
        <Inner />
      </Wrapper>
    </>
  ),
}
