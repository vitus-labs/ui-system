'use client'

import './setup'
import { config } from '@vitus-labs/core'
import { Element } from '@vitus-labs/elements'
import { Row, Col } from '@vitus-labs/coolgrid'
import rocketstyle from '@vitus-labs/rocketstyle'
import { makeItResponsive, styles } from '@vitus-labs/unistyle'

const { styled } = config

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #111;
`

const Badge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #e8f4fd;
  color: #0070f3;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 8px;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 4px;
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 40px;
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 16px;
  padding-top: 16px;
`

const Card = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  margin-bottom: 24px;
`

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 8px;
`

const CardText = styled.p`
  font-size: 0.875rem;
  color: #555;
  line-height: 1.6;
  margin: 0 0 16px;
`

const ElementDemo = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e9ecef;
`

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #0070f3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

// Rocketstyle button with dimension-based states and boolean prop shortcuts
const RsButton = rocketstyle()({
  name: 'RsButton',
  component: Element,
})
  .attrs({ tag: 'button' })
  .theme({
    bgColor: '#0070f3',
    color: '#fff',
    hover: { bgColor: '#0060df' },
  })
  .states({
    primary: {
      bgColor: '#0070f3',
      color: '#fff',
      hover: { bgColor: '#0060df' },
    },
    secondary: {
      bgColor: '#6c757d',
      color: '#fff',
      hover: { bgColor: '#5c636a' },
    },
    outline: {
      bgColor: 'transparent',
      color: '#0070f3',
      hover: { bgColor: '#e8f4fd' },
    },
  })
  .styles(
    (css) => css`
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;

      ${({ $rocketstyle: t }: any) => css`
        color: ${t.color};
        background-color: ${t.bgColor};

        &:hover {
          background-color: ${t.hover?.bgColor};
        }
      `};
    `,
  )

// Rocketstyle button using unistyle's data-driven CSS processor
const UnistyleButton = rocketstyle()({
  name: 'UnistyleButton',
  component: Element,
})
  .attrs({ tag: 'button' })
  .theme({
    height: 40,
    fontSize: 14,
    paddingX: 20,
    paddingY: 0,
    backgroundColor: '#0070f3',
    color: '#fff',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    hover: { backgroundColor: '#0060df' },
  })
  .states({
    primary: {
      backgroundColor: '#0070f3',
      color: '#fff',
      hover: { backgroundColor: '#0060df' },
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: '#fff',
      hover: { backgroundColor: '#5c636a' },
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#0070f3',
      border: '1px solid #0070f3',
      hover: { backgroundColor: '#e8f4fd' },
    },
  })
  .styles(
    (css) => css`
      font-weight: 500;

      ${({ $rocketstyle, $rocketstate: { disabled, pseudo } }: any) => {
        const { hover: hoverStyles = {}, ...restStyles } = $rocketstyle
        const baseTheme = makeItResponsive({ theme: restStyles, styles, css })
        const hoverTheme = makeItResponsive({ theme: hoverStyles, styles, css })

        return css`
          ${baseTheme};
          ${!disabled &&
          css`
            &:hover {
              ${hoverTheme};
            }
          `};
          ${pseudo?.hover && css`${hoverTheme};`};
        `
      }};
    `,
  )

export default function Home() {
  return (
    <Wrapper>
      <Badge>Next.js + Emotion</Badge>
      <Title>UI System Examples</Title>
      <Subtitle>
        Pluggable CSS-in-JS with @vitus-labs packages
      </Subtitle>

      <SectionTitle>Responsive Grid</SectionTitle>
      <Row gap={24}>
        <Col size={{ xs: 12, md: 4 }}>
          <Card>
            <CardTitle>config.styled</CardTitle>
            <CardText>
              Create styled components via config — engine-agnostic API
              that works with styler, styled-components, or Emotion.
            </CardText>
          </Card>
        </Col>
        <Col size={{ xs: 12, md: 4 }}>
          <Card>
            <CardTitle>coolgrid</CardTitle>
            <CardText>
              Responsive grid system with Container, Row, and Col.
              Supports breakpoint-based sizing.
            </CardText>
          </Card>
        </Col>
        <Col size={{ xs: 12, md: 4 }}>
          <Card>
            <CardTitle>Provider</CardTitle>
            <CardText>
              Theme context passed to all styled components.
              Supports breakpoints, rootSize, and custom values.
            </CardText>
          </Card>
        </Col>
      </Row>

      <SectionTitle>Element Component</SectionTitle>
      <ElementDemo>
        <Element
          tag="div"
          beforeContent={<IconBox>&#8592;</IconBox>}
          afterContent={<IconBox>&#8594;</IconBox>}
          direction="inline"
          gap={16}
          alignY="center"
        >
          <span>
            Element with beforeContent and afterContent — a flexible layout
            primitive from @vitus-labs/elements
          </span>
        </Element>
      </ElementDemo>

      <SectionTitle>Rocketstyle</SectionTitle>
      <Card>
        <CardTitle>Stateful Button</CardTitle>
        <CardText>
          Rocketstyle component with dimension-based states. Boolean props
          (primary, secondary, outline) select the active state.
        </CardText>
        <ButtonRow>
          <RsButton primary>Primary</RsButton>
          <RsButton secondary>Secondary</RsButton>
          <RsButton outline>Outline</RsButton>
        </ButtonRow>
      </Card>
      <SectionTitle>Rocketstyle + Unistyle</SectionTitle>
      <Card>
        <CardTitle>Data-Driven Styling</CardTitle>
        <CardText>
          Rocketstyle component using unistyle's makeItResponsive and styles
          for data-driven CSS generation. Theme values use CSS property names
          (height, fontSize, paddingX, backgroundColor) and are automatically
          converted to CSS.
        </CardText>
        <ButtonRow>
          <UnistyleButton primary>Primary</UnistyleButton>
          <UnistyleButton secondary>Secondary</UnistyleButton>
          <UnistyleButton outline>Outline</UnistyleButton>
        </ButtonRow>
      </Card>
    </Wrapper>
  )
}
