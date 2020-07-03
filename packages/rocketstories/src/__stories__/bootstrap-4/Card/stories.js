import theme from '../themeDecorator'
import Card, { Header, Body, Footer, Image, Title, Subtitle, Navigation } from '.'
import Button from '../Button'
import Link from '../Link'
import List from '../List'
import Text from '../Text'
import Utility from '../Utils/Box'

storiesOf(Card.displayName, module)
  .addDecorator(theme)
  .add('Example', () => (
    <Fragment>
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
    </Fragment>
  ))
  .add('Content types', () => (
    <Fragment>
      <Card style={{ width: '18rem' }}>
        <Body>
          Some quick example text to build on the card title and make up the bulk of
          the card's content.
        </Body>
      </Card>
      <Card style={{ width: '18rem' }}>
        <Body>
          <Title>Cart title</Title>
          <Subtitle>Cart subtitle</Subtitle>
          <Text>
            Some quick example text to build on the card title and make up the bulk
            of the card's content.
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
            Some quick example text to build on the card title and make up the bulk
            of the card's content.
          </Text>
        </Body>
      </Card>

      <Card style={{ width: '18rem' }}>
        <List
          flush
          data={[
            { label: 'Cras justo odio' },
            { label: 'Dapibus ac facilisis in' },
            { label: 'Vestibulum at eros' }
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
            { label: 'Vestibulum at eros' }
          ]}
        />
      </Card>

      <Card style={{ width: '18rem' }}>
        <Header>Featured</Header>
        <Body>
          <Title>Card title</Title>
          <Text>
            Some quick example text to build on the card title and make up the bulk
            of the card's content.
          </Text>
        </Body>
        <List
          flush
          data={[
            { label: 'Cras justo odio' },
            { label: 'Dapibus ac facilisis in' },
            { label: 'Vestibulum at eros' }
          ]}
        />
        <Body contentDirection="inline">
          <Link>Card link</Link>
          <Link>Another link</Link>
        </Body>
      </Card>
    </Fragment>
  ))
  .add('Header and Footer', () => (
    <Fragment>
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
    </Fragment>
  ))
  .add('Using utilities', () => (
    <Fragment>
      <Utility w75>
        <Card>
          <Body>
            <Title>Card title</Title>
            <Text>
              With supporting text below as a natural lead-in to additional content.
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
              With supporting text below as a natural lead-in to additional content.
            </Text>
            <Button primary label="Button" />
          </Body>
        </Card>
      </Utility>
    </Fragment>
  ))
  .add('Text alignment', () => (
    <Fragment>
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
    </Fragment>
  ))
  .add('Navigation', () => {
    const data = [
      { label: 'Active', href: '#', active: true },
      { label: 'Link', href: '#' },
      { label: 'Disable', href: '#', disabled: true }
    ]
    return (
      <Fragment>
        <Card style={{ width: '36rem' }}>
          <Header>
            <Navigation tabs data={data} />
          </Header>
          <Body>
            <Title>Special title treatment</Title>
            Some quick example text to build on the card title and make up the bulk
            of the card's content.
          </Body>
        </Card>

        <Card style={{ width: '36rem' }}>
          <Header>
            <Navigation pills data={data} />
          </Header>
          <Body>
            <Title>Special title treatment</Title>
            Some quick example text to build on the card title and make up the bulk
            of the card's content.
          </Body>
        </Card>
      </Fragment>
    )
  })
  .add('Card styles / Background color', () => {
    return (
      <Fragment>
        <Utility bgPrimary textWhite>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Primary card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>

        <Utility bgSecondary textWhite>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Secondary card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>

        <Utility bgSuccess textWhite>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Success card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>

        <Utility bgDanger textWhite>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Danger card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>

        <Utility bgWarning textWhite>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Warning card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>

        <Utility bgInfo textWhite>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Info card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>

        <Utility bgLight>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Light card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>

        <Utility bgDark textWhite>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Dark card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>
      </Fragment>
    )
  })
  .add('Card styles / Borders', () => {
    return (
      <Fragment>
        <Utility borderPrimary>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Utility textPrimary>
              <Body>
                <Title>Primary card title</Title>
                <Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Text>
              </Body>
            </Utility>
          </Card>
        </Utility>

        <Utility borderSecondary>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Utility textSecondary>
              <Body>
                <Title>Secondary card title</Title>
                <Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Text>
              </Body>
            </Utility>
          </Card>
        </Utility>

        <Utility borderSuccess>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Utility textSuccess>
              <Body>
                <Title>Success card title</Title>
                <Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Text>
              </Body>
            </Utility>
          </Card>
        </Utility>

        <Utility borderDanger>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Utility textDanger>
              <Body>
                <Title>Danger card title</Title>
                <Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Text>
              </Body>
            </Utility>
          </Card>
        </Utility>

        <Utility borderWarning>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Utility textWarning>
              <Body>
                <Title>Warning card title</Title>
                <Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Text>
              </Body>
            </Utility>
          </Card>
        </Utility>

        <Utility borderInfo>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Utility textInfo>
              <Body>
                <Title>Info card title</Title>
                <Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Text>
              </Body>
            </Utility>
          </Card>
        </Utility>

        <Utility borderLight>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Body>
              <Title>Light card title</Title>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
            </Body>
          </Card>
        </Utility>

        <Utility borderDark>
          <Card style={{ width: '18rem' }}>
            <Header>Header</Header>
            <Utility textDark>
              <Body>
                <Title>Dark card title</Title>
                <Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Text>
              </Body>
            </Utility>
          </Card>
        </Utility>
      </Fragment>
    )
  })
