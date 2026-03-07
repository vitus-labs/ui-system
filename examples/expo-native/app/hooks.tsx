import {
  useBreakpoint,
  useColorScheme,
  useReducedMotion,
  useToggle,
  useWindowResize,
} from '@vitus-labs/hooks'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

function BreakpointDemo() {
  const breakpoint = useBreakpoint()
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>useBreakpoint</Text>
      <Text style={styles.cardValue}>{breakpoint ?? 'no breakpoints'}</Text>
    </View>
  )
}

function ColorSchemeDemo() {
  const scheme = useColorScheme()
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>useColorScheme</Text>
      <Text style={styles.cardValue}>{scheme}</Text>
    </View>
  )
}

function ReducedMotionDemo() {
  const reduced = useReducedMotion()
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>useReducedMotion</Text>
      <Text style={styles.cardValue}>{reduced ? 'Enabled' : 'Disabled'}</Text>
    </View>
  )
}

function WindowResizeDemo() {
  const { width, height } = useWindowResize()
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>useWindowResize</Text>
      <Text style={styles.cardValue}>
        {width} × {height}
      </Text>
    </View>
  )
}

function ToggleDemo() {
  const [active, toggle] = useToggle(false)
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>useToggle</Text>
      <Text
        style={[styles.cardValue, { color: active ? '#2ecc71' : '#e74c3c' }]}
        onPress={toggle}
      >
        {active ? 'ON' : 'OFF'} (tap to toggle)
      </Text>
    </View>
  )
}

export default function HooksScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hooks (React Native)</Text>
      <Text style={styles.subtitle}>
        Native-adapted hooks with RN APIs
      </Text>

      <BreakpointDemo />
      <ColorSchemeDemo />
      <ReducedMotionDemo />
      <WindowResizeDemo />
      <ToggleDemo />

      <View style={styles.spacer} />
    </ScrollView>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  spacer: {
    height: 40,
  },
})
