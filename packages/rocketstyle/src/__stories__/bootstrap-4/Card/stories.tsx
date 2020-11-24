import React from 'react'
import Card, { Header, Body, Footer, Image, Title, Subtitle } from '.'
import Button from '../Button'
import Link from '../Link'
import List from '../List'
import Text from '../Text'

export default {
  component: Card,
  title: 'Card',
}

export const examples = () => (
  <Card style={{ width: '18rem' }}>
    <Body>
      <Title>Card title</Title>
      <Text>
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </Text>
      <Button tag="a" href="#" primary>
        Go somewhere
      </Button>
    </Body>
  </Card>
)

export const contentTypes = () => (
  <>
    <Card style={{ width: '18rem' }}>
      <Body>
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </Body>
    </Card>
    <Card style={{ width: '18rem' }}>
      <Body>
        <Title>Cart title</Title>
        <Subtitle>Cart subtitle</Subtitle>
        <Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Text>
        <div>
          <Link label="Card link" />
          <Link label="Another link" />
        </div>
      </Body>
    </Card>
    <Card style={{ width: '18rem' }}>
      <Image top src={require('../../placeholder.gif')} />
      <Body>
        <Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Text>
      </Body>
    </Card>

    <Card style={{ width: '18rem' }}>
      <List
        flush
        data={[
          { label: 'Cras justo odio' },
          { label: 'Dapibus ac facilisis in' },
          { label: 'Vestibulum at eros' },
        ]}
      />
    </Card>

    <Card style={{ width: '18rem' }}>
      <Header>Featured</Header>
      <List
        flush
        data={[
          { label: 'Cras justo odio' },
          { label: 'Dapibus ac facilisis in' },
          { label: 'Vestibulum at eros' },
        ]}
      />
    </Card>

    <Card style={{ width: '18rem' }}>
      <Header>Featured</Header>
      <Body>
        <Title>Card title</Title>
        <Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Text>
      </Body>
      <List
        flush
        data={[
          { label: 'Cras justo odio' },
          { label: 'Dapibus ac facilisis in' },
          { label: 'Vestibulum at eros' },
        ]}
      />
      <Body contentDirection="inline">
        <Link>Card link</Link>
        <Link>Another link</Link>
      </Body>
    </Card>
  </>
)

export const headerAndFooter = () => (
  <>
    <Card style={{ width: '36rem' }}>
      <Header>Featured</Header>
      <Body>
        <Title>Special title treatment</Title>
        <Text>
          With supporting text below as a natural lead-in to additional content.
        </Text>
        <Button primary label="Go somewhere" />
      </Body>
    </Card>

    <Card style={{ width: '36rem' }}>
      <Header contentAlignX="center">Featured</Header>
      <Body contentAlignX="center">
        <Title>Special title treatment</Title>
        <Text>
          With supporting text below as a natural lead-in to additional content.
        </Text>
        <Button primary label="Go somewhere" />
      </Body>
      <Footer contentAlignX="center">2 days ago</Footer>
    </Card>

    <Card style={{ width: '36rem' }}>
      <Header contentAlignX="center">Featured</Header>
      <Header contentAlignX="center">Subheader</Header>
      <Body contentAlignX="center">
        <Title>Special title treatment</Title>
        <Text>
          With supporting text below as a natural lead-in to additional content.
        </Text>
        <Button primary label="Go somewhere" />
      </Body>
      <Footer contentAlignX="center">2 days ago</Footer>
    </Card>
  </>
)

export const usingUtilities = () => (
  <>
    <Utility w75>
      <Card>
        <Body>
          <Title>Card title</Title>
          <Text>
            With supporting text below as a natural lead-in to additional
            content.
          </Text>
          <Button primary label="Button" />
        </Body>
      </Card>
    </Utility>
    <Utility w50>
      <Card>
        <Body>
          <Title>Card title</Title>
          <Text>
            With supporting text below as a natural lead-in to additional
            content.
          </Text>
          <Button primary label="Button" />
        </Body>
      </Card>
    </Utility>
  </>
)

export const textAlignment = () => (
  <>
    <Card style={{ width: '18rem' }}>
      <Body>
        <Title>Special title treatment</Title>
        <Text>
          With supporting text below as a natural lead-in to additional content.
        </Text>
        <Button primary label="Go somewhere" />
      </Body>
    </Card>

    <Card style={{ width: '18rem' }}>
      <Body contentAlignX="center">
        <Title>Special title treatment</Title>
        <Text>
          With supporting text below as a natural lead-in to additional content.
        </Text>
        <Button primary label="Go somewhere" />
      </Body>
    </Card>

    <Card style={{ width: '18rem' }}>
      <Body contentAlignX="right">
        <Title>Special title treatment</Title>
        <Text>
          With supporting text below as a natural lead-in to additional content.
        </Text>
        <Button primary label="Go somewhere" />
      </Body>
    </Card>
  </>
)
