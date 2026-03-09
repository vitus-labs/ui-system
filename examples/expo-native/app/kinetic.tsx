import {
  kinetic,
  fade,
  scaleIn,
  slideDown,
  slideLeft,
  slideRight,
  slideUp,
} from '@vitus-labs/kinetic'
import type { Preset } from '@vitus-labs/kinetic'
import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

// ---- Built-in presets ----
const Fade = kinetic(View).preset(fade)
const ScaleIn = kinetic(View).preset(scaleIn)
const SlideUp = kinetic(View).preset(slideUp)
const SlideDown = kinetic(View).preset(slideDown)
const SlideLeft = kinetic(View).preset(slideLeft)
const SlideRight = kinetic(View).preset(slideRight)

// ---- Custom presets ----
const zoomRotate: Preset = {
  enterStyle: { opacity: 0, transform: 'scale(0.5) rotate(45deg)' },
  enterToStyle: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
  enterTransition: 'opacity 400ms ease-out, transform 400ms ease-out',
  leaveStyle: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
  leaveToStyle: { opacity: 0, transform: 'scale(0.5) rotate(-45deg)' },
  leaveTransition: 'opacity 300ms ease-in, transform 300ms ease-in',
}

const flipY: Preset = {
  enterStyle: { opacity: 0, transform: 'rotateY(90deg)' },
  enterToStyle: { opacity: 1, transform: 'rotateY(0deg)' },
  enterTransition: 'opacity 500ms ease-out, transform 500ms ease-out',
  leaveStyle: { opacity: 1, transform: 'rotateY(0deg)' },
  leaveToStyle: { opacity: 0, transform: 'rotateY(90deg)' },
  leaveTransition: 'opacity 300ms ease-in, transform 300ms ease-in',
}

const bounceIn: Preset = {
  enterStyle: { opacity: 0, transform: 'scale(0.3)' },
  enterToStyle: { opacity: 1, transform: 'scale(1)' },
  enterTransition: 'opacity 500ms ease-out, transform 500ms ease-out',
  leaveStyle: { opacity: 1, transform: 'scale(1)' },
  leaveToStyle: { opacity: 0, transform: 'scale(0.3)' },
  leaveTransition: 'opacity 200ms ease-in, transform 200ms ease-in',
}

const slideUpBig: Preset = {
  enterStyle: { opacity: 0, transform: 'translateY(100px)' },
  enterToStyle: { opacity: 1, transform: 'translateY(0)' },
  enterTransition: 'opacity 400ms ease-out, transform 400ms ease-out',
  leaveStyle: { opacity: 1, transform: 'translateY(0)' },
  leaveToStyle: { opacity: 0, transform: 'translateY(100px)' },
  leaveTransition: 'opacity 300ms ease-in, transform 300ms ease-in',
}

const scaleX: Preset = {
  enterStyle: { opacity: 0, transform: 'scaleX(0)' },
  enterToStyle: { opacity: 1, transform: 'scaleX(1)' },
  enterTransition: 'opacity 400ms ease-out, transform 400ms ease-out',
  leaveStyle: { opacity: 1, transform: 'scaleX(1)' },
  leaveToStyle: { opacity: 0, transform: 'scaleX(0)' },
  leaveTransition: 'opacity 200ms ease-in, transform 200ms ease-in',
}

const ZoomRotate = kinetic(View).preset(zoomRotate)
const FlipY = kinetic(View).preset(flipY)
const BounceIn = kinetic(View).preset(bounceIn)
const SlideUpBig = kinetic(View).preset(slideUpBig)
const ScaleX = kinetic(View).preset(scaleX)

// ---- Chain API examples ----
const CustomChain = kinetic(View)
  .enter({ opacity: 0, transform: 'translateX(-50px) scale(0.8)' })
  .enterTo({ opacity: 1, transform: 'translateX(0px) scale(1)' })
  .enterTransition('opacity 400ms ease-out, transform 400ms ease-out')
  .leave({ opacity: 1, transform: 'translateX(0px) scale(1)' })
  .leaveTo({ opacity: 0, transform: 'translateX(50px) scale(0.8)' })
  .leaveTransition('opacity 300ms ease-in, transform 300ms ease-in')

// ---- Reusable demo component ----
function AnimDemo({
  label,
  color,
  Component,
}: {
  label: string
  color: string
  Component: any
}) {
  const [show, setShow] = useState(true)

  return (
    <>
      <View style={styles.demoHeader}>
        <Text style={styles.demoLabel}>{label}</Text>
        <Pressable
          style={[styles.toggleBtn, show ? styles.toggleOn : styles.toggleOff]}
          onPress={() => setShow((v) => !v)}
        >
          <Text style={styles.toggleText}>{show ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>
      <Component show={show}>
        <View style={[styles.animBox, { backgroundColor: color }]}>
          <Text style={styles.animText}>{label}</Text>
        </View>
      </Component>
    </>
  )
}

export default function KineticScreen() {
  const [showAll, setShowAll] = useState(true)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kinetic Animations</Text>
      <Text style={styles.subtitle}>
        Animated transitions using RN Animated API
      </Text>

      {/* Global toggle */}
      <Pressable
        style={styles.globalToggle}
        onPress={() => setShowAll((v) => !v)}
      >
        <Text style={styles.globalToggleText}>
          {showAll ? 'Hide' : 'Show'} All
        </Text>
      </Pressable>

      {/* Built-in presets */}
      <Text style={styles.sectionTitle}>Built-in Presets</Text>

      <AnimDemo label="Fade" color="#0070f3" Component={Fade} />
      <AnimDemo label="Scale In" color="#9b59b6" Component={ScaleIn} />
      <AnimDemo label="Slide Up" color="#2ecc71" Component={SlideUp} />
      <AnimDemo label="Slide Down" color="#e74c3c" Component={SlideDown} />
      <AnimDemo label="Slide Left" color="#f39c12" Component={SlideLeft} />
      <AnimDemo label="Slide Right" color="#1abc9c" Component={SlideRight} />

      {/* Custom presets */}
      <Text style={styles.sectionTitle}>Custom Presets</Text>

      <AnimDemo label="Zoom + Rotate" color="#e91e63" Component={ZoomRotate} />
      <AnimDemo label="Flip Y" color="#00bcd4" Component={FlipY} />
      <AnimDemo label="Bounce In" color="#ff5722" Component={BounceIn} />
      <AnimDemo label="Slide Up Big" color="#795548" Component={SlideUpBig} />
      <AnimDemo label="Scale X" color="#607d8b" Component={ScaleX} />

      {/* Chain API */}
      <Text style={styles.sectionTitle}>Chain API</Text>

      <AnimDemo
        label="Custom Chain (slide + scale)"
        color="#3f51b5"
        Component={CustomChain}
      />

      {/* Appear on mount */}
      <Text style={styles.sectionTitle}>Appear on Mount</Text>
      <Text style={styles.hint}>
        These animate in when they first mount (appear=true)
      </Text>
      <Fade show={showAll} appear>
        <View style={[styles.animBox, { backgroundColor: '#0070f3' }]}>
          <Text style={styles.animText}>Fade appear</Text>
        </View>
      </Fade>
      <View style={{ height: 8 }} />
      <ScaleIn show={showAll} appear>
        <View style={[styles.animBox, { backgroundColor: '#9b59b6' }]}>
          <Text style={styles.animText}>ScaleIn appear</Text>
        </View>
      </ScaleIn>
      <View style={{ height: 8 }} />
      <SlideUp show={showAll} appear>
        <View style={[styles.animBox, { backgroundColor: '#2ecc71' }]}>
          <Text style={styles.animText}>SlideUp appear</Text>
        </View>
      </SlideUp>

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
    fontSize: 18,
    fontWeight: '700',
    marginTop: 32,
    marginBottom: 16,
    color: '#111',
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  globalToggle: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  globalToggleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  demoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  demoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  toggleOn: {
    backgroundColor: '#e74c3c',
  },
  toggleOff: {
    backgroundColor: '#2ecc71',
  },
  toggleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
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
    height: 60,
  },
})
