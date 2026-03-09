import { Element, Text as VLText } from '@vitus-labs/elements'
import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { Cell, Screen, Section } from '../src/components'

export default function HomeScreen() {
  return (
    <Screen
      title="Vitus Labs - React Native"
      subtitle="Testing connector-native + all packages"
    >
      <Section title="1. Basic Element">
        <Element direction="inline" alignY="center" gap={12} block>
          <Text>Element with direction=inline, gap=12, block</Text>
        </Element>
      </Section>

      <Section title="2. Element with slots">
        <Element
          direction="inline"
          alignY="center"
          gap={12}
          block
          beforeContent={<Cell color="#0070f3" label="B" height={40} />}
          afterContent={<Cell color="#e74c3c" label="A" height={40} />}
        >
          <Text>Content between before/after</Text>
        </Element>
      </Section>

      <Section title="3. VL Text">
        <VLText>This is a VLText component</VLText>
      </Section>

      <Section title="4. Vertical Element">
        <Element direction="rows" alignX="center" gap={8} block>
          <Cell color="#2ecc71" label="1" height={40} />
          <Cell color="#3498db" label="2" height={40} />
          <Cell color="#9b59b6" label="3" height={40} />
        </Element>
      </Section>

      <View style={styles.nav}>
        <Text style={styles.navTitle}>More Examples</Text>
        <Link href="/coolgrid" style={styles.link}>
          <Text style={styles.linkText}>Coolgrid Demo</Text>
        </Link>
        <Link href="/kinetic" style={styles.link}>
          <Text style={styles.linkText}>Kinetic Animations Demo</Text>
        </Link>
        <Link href="/hooks" style={styles.link}>
          <Text style={styles.linkText}>Hooks Demo</Text>
        </Link>
        <Link href="/rocketstyle" style={styles.link}>
          <Text style={styles.linkText}>Rocketstyle Demo</Text>
        </Link>
        <Link href="/attrs" style={styles.link}>
          <Text style={styles.linkText}>Attrs Demo</Text>
        </Link>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  nav: { marginTop: 32 },
  navTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: { fontSize: 16, color: '#0070f3', fontWeight: '500' },
})
