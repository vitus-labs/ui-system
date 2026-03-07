import { kinetic, fade, slideDown, slideLeft } from '@vitus-labs/kinetic'
import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const Transition = kinetic({
  tag: View,
  ...fade,
})

const SlideDown = kinetic({
  tag: View,
  ...slideDown,
})

const SlideLeft = kinetic({
  tag: View,
  ...slideLeft,
})

export default function KineticScreen() {
  const [showFade, setShowFade] = useState(true)
  const [showSlideDown, setShowSlideDown] = useState(true)
  const [showSlideLeft, setShowSlideLeft] = useState(true)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kinetic (React Native)</Text>
      <Text style={styles.subtitle}>
        Animated transitions using RN Animated API
      </Text>

      <Text style={styles.sectionTitle}>1. Fade</Text>
      <Pressable
        style={styles.button}
        onPress={() => setShowFade((v) => !v)}
      >
        <Text style={styles.buttonText}>
          {showFade ? 'Hide' : 'Show'} Fade
        </Text>
      </Pressable>
      <Transition show={showFade}>
        <View style={[styles.animBox, { backgroundColor: '#0070f3' }]}>
          <Text style={styles.animText}>Fade transition</Text>
        </View>
      </Transition>

      <Text style={styles.sectionTitle}>2. Slide Down</Text>
      <Pressable
        style={styles.button}
        onPress={() => setShowSlideDown((v) => !v)}
      >
        <Text style={styles.buttonText}>
          {showSlideDown ? 'Hide' : 'Show'} Slide Down
        </Text>
      </Pressable>
      <SlideDown show={showSlideDown}>
        <View style={[styles.animBox, { backgroundColor: '#2ecc71' }]}>
          <Text style={styles.animText}>Slide down transition</Text>
        </View>
      </SlideDown>

      <Text style={styles.sectionTitle}>3. Slide Left</Text>
      <Pressable
        style={styles.button}
        onPress={() => setShowSlideLeft((v) => !v)}
      >
        <Text style={styles.buttonText}>
          {showSlideLeft ? 'Hide' : 'Show'} Slide Left
        </Text>
      </Pressable>
      <SlideLeft show={showSlideLeft}>
        <View style={[styles.animBox, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.animText}>Slide left transition</Text>
        </View>
      </SlideLeft>

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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  animBox: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  animText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  spacer: {
    height: 40,
  },
})
