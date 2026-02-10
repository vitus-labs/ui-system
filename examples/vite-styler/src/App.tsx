import { config, Provider } from '@vitus-labs/core'
import { Element } from '@vitus-labs/elements'
import { Row, Col } from '@vitus-labs/coolgrid'

const { styled } = config

const theme = {
  rootSize: 16,
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
}

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
  margin: 0;
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

export default function App() {
  return (
    <Provider theme={theme}>
      <Wrapper>
        <Badge>Vite + @vitus-labs/styler</Badge>
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
      </Wrapper>
    </Provider>
  )
}
