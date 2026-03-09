import { Element, Text as VLText } from '@vitus-labs/elements'
import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

const Box = ({ color, label }: { color: string; label: string }) => (
  <View style={[styles.box, { backgroundColor: color }]}>
    <Text style={styles.boxText}>{label}</Text>
  </View>
)

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitus Labs - React Native</Text>
      <Text style={styles.subtitle}>
        Testing connector-native + all packages
      </Text>

      <Text style={styles.sectionTitle}>1. Basic Element</Text>
      <Element direction="inline" alignY="center" gap={12} block>
        <Text>Element with direction=inline, gap=12, block</Text>
      </Element>

      <Text style={styles.sectionTitle}>2. Element with slots</Text>
      <Element
        direction="inline"
        alignY="center"
        gap={12}
        block
        beforeContent={<Box color="#0070f3" label="B" />}
        afterContent={<Box color="#e74c3c" label="A" />}
      >
        <Text>Content between before/after</Text>
      </Element>

      <Text style={styles.sectionTitle}>3. VL Text</Text>
      <VLText>This is a VLText component</VLText>

      <Text style={styles.sectionTitle}>4. Vertical Element</Text>
      <Element direction="rows" alignX="center" gap={8} block>
        <Box color="#2ecc71" label="1" />
        <Box color="#3498db" label="2" />
        <Box color="#9b59b6" label="3" />
      </Element>

      <View style={styles.nav}>
        <Text style={styles.sectionTitle}>More Examples</Text>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  box: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  nav: {
    marginTop: 32,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#0070f3',
    fontWeight: '500',
  },
})
