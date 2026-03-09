import { Element, Text as VLText } from '@vitus-labs/elements'
import rocketstyle from '@vitus-labs/rocketstyle'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

// ═══════════════════════════════════════════════════════════════════════
// 1. Basic rocketstyle component with theme
// ═══════════════════════════════════════════════════════════════════════
const Badge = rocketstyle()({
  name: 'Badge',
  component: Element,
})
  .attrs({
    tag: 'span',
    direction: 'inline',
    alignX: 'center',
    alignY: 'center',
  })
  .theme({
    paddingX: 12,
    paddingY: 6,
    backgroundColor: '#0070f3',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    borderRadius: 6,
  })

// ═══════════════════════════════════════════════════════════════════════
// 2. States dimension — multiple visual variants via `state` prop
// ═══════════════════════════════════════════════════════════════════════
const StatusBadge = rocketstyle()({
  name: 'StatusBadge',
  component: Element,
})
  .attrs({
    tag: 'span',
    direction: 'inline',
    alignX: 'center',
    alignY: 'center',
  })
  .theme({
    paddingX: 14,
    paddingY: 8,
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#999',
  })
  .states({
    success: { backgroundColor: '#2ecc71' },
    warning: { backgroundColor: '#f39c12' },
    error: { backgroundColor: '#e74c3c' },
    info: { backgroundColor: '#3498db' },
  })

// ═══════════════════════════════════════════════════════════════════════
// 3. Sizes dimension
// ═══════════════════════════════════════════════════════════════════════
const Chip = rocketstyle()({
  name: 'Chip',
  component: Element,
})
  .attrs({
    tag: 'span',
    direction: 'inline',
    alignX: 'center',
    alignY: 'center',
  })
  .theme({
    backgroundColor: '#e0e0e0',
    color: '#333',
    fontWeight: 600,
    borderRadius: 20,
    paddingX: 12,
    paddingY: 6,
    fontSize: 13,
  })
  .sizes({
    small: { paddingX: 8, paddingY: 4, fontSize: 11 },
    medium: { paddingX: 12, paddingY: 6, fontSize: 13 },
    large: { paddingX: 18, paddingY: 10, fontSize: 16 },
  })

// ═══════════════════════════════════════════════════════════════════════
// 4. Variants dimension
// ═══════════════════════════════════════════════════════════════════════
const Card = rocketstyle()({
  name: 'Card',
  component: Element,
})
  .attrs({
    direction: 'rows',
    gap: 8,
    block: true,
  })
  .theme({
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  })
  .variants({
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#ddd',
    },
    elevated: {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffsetY: 4,
      elevation: 4,
    },
    colored: {
      backgroundColor: '#e8f4fd',
      borderWidth: 1,
      borderColor: '#90caf9',
    },
  })

// ═══════════════════════════════════════════════════════════════════════
// 5. Combined states + sizes
// ═══════════════════════════════════════════════════════════════════════
const Button = rocketstyle()({
  name: 'Button',
  component: Element,
})
  .attrs({
    tag: 'button',
    direction: 'inline',
    alignX: 'center',
    alignY: 'center',
  })
  .theme({
    paddingX: 16,
    paddingY: 10,
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#0070f3',
  })
  .states({
    primary: { backgroundColor: '#0070f3' },
    secondary: { backgroundColor: '#6c757d' },
    success: { backgroundColor: '#2ecc71' },
    danger: { backgroundColor: '#e74c3c' },
  })
  .sizes({
    small: { paddingX: 10, paddingY: 6, fontSize: 12 },
    medium: { paddingX: 16, paddingY: 10, fontSize: 14 },
    large: { paddingX: 24, paddingY: 14, fontSize: 18 },
  })

// ═══════════════════════════════════════════════════════════════════════
// 6. Chained .attrs with callbacks
// ═══════════════════════════════════════════════════════════════════════
const Avatar = rocketstyle()({
  name: 'Avatar',
  component: Element,
})
  .attrs({
    direction: 'inline',
    alignX: 'center',
    alignY: 'center',
  })
  .theme({
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9b59b6',
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
  })
  .sizes({
    small: { width: 32, height: 32, borderRadius: 16, fontSize: 13 },
    medium: { width: 48, height: 48, borderRadius: 24, fontSize: 18 },
    large: { width: 64, height: 64, borderRadius: 32, fontSize: 24 },
  })
  .states({
    blue: { backgroundColor: '#3498db' },
    green: { backgroundColor: '#2ecc71' },
    red: { backgroundColor: '#e74c3c' },
    purple: { backgroundColor: '#9b59b6' },
  })

// ═══════════════════════════════════════════════════════════════════════
// 7. Using .theme() to create a divider
// ═══════════════════════════════════════════════════════════════════════
const Divider = rocketstyle()({
  name: 'Divider',
  component: Element,
})
  .attrs({ block: true })
  .theme({
    height: 1,
    backgroundColor: '#e0e0e0',
    marginY: 16,
  })

// ═══════════════════════════════════════════════════════════════════════
// 8. Tag / Label component with multiple states
// ═══════════════════════════════════════════════════════════════════════
const Tag = rocketstyle()({
  name: 'Tag',
  component: Element,
})
  .attrs({
    tag: 'span',
    direction: 'inline',
    alignX: 'center',
    alignY: 'center',
  })
  .theme({
    paddingX: 10,
    paddingY: 4,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    backgroundColor: '#eee',
    color: '#555',
  })
  .states({
    new: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
    hot: { backgroundColor: '#fbe9e7', color: '#d84315' },
    beta: { backgroundColor: '#e3f2fd', color: '#1565c0' },
    deprecated: { backgroundColor: '#fafafa', color: '#999' },
  })

// ═══════════════════════════════════════════════════════════════════════
// Demo helpers
// ═══════════════════════════════════════════════════════════════════════
const Section = ({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {note && <Text style={styles.sectionNote}>{note}</Text>}
    <View style={styles.sectionBody}>{children}</View>
  </View>
)

const Row = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.row}>{children}</View>
)

// ═══════════════════════════════════════════════════════════════════════
// Screen
// ═══════════════════════════════════════════════════════════════════════
export default function RocketstyleScreen() {
  const [activeState, setActiveState] = useState<
    'primary' | 'secondary' | 'success' | 'danger'
  >('primary')

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rocketstyle</Text>
      <Text style={styles.subtitle}>
        Design-system primitives with dimensions (states, sizes, variants)
      </Text>

      {/* 1 – Basic theme */}
      <Section title="1. Basic Badge" note=".theme() sets default styling">
        <Row>
          <Badge>
            <VLText>Default Badge</VLText>
          </Badge>
        </Row>
      </Section>

      {/* 2 – States */}
      <Section title="2. States" note=".states() adds state prop variants">
        <Row>
          <StatusBadge state="success">
            <VLText>Success</VLText>
          </StatusBadge>
          <StatusBadge state="warning">
            <VLText>Warning</VLText>
          </StatusBadge>
          <StatusBadge state="error">
            <VLText>Error</VLText>
          </StatusBadge>
          <StatusBadge state="info">
            <VLText>Info</VLText>
          </StatusBadge>
        </Row>
      </Section>

      {/* 3 – Sizes */}
      <Section title="3. Sizes" note=".sizes() adds size prop variants">
        <Row>
          <Chip size="small">
            <VLText>Small</VLText>
          </Chip>
          <Chip size="medium">
            <VLText>Medium</VLText>
          </Chip>
          <Chip size="large">
            <VLText>Large</VLText>
          </Chip>
        </Row>
      </Section>

      {/* 4 – Variants */}
      <Section title="4. Variants" note=".variants() for visual style variations">
        <Card variant="outlined">
          <VLText>Outlined card with a border</VLText>
        </Card>
        <View style={{ height: 8 }} />
        <Card variant="elevated">
          <VLText>Elevated card with shadow</VLText>
        </Card>
        <View style={{ height: 8 }} />
        <Card variant="colored">
          <VLText>Colored card with background tint</VLText>
        </Card>
      </Section>

      {/* 5 – Combined states + sizes */}
      <Section
        title="5. Combined Dimensions"
        note="state + size applied together"
      >
        <Row>
          <Button state="primary" size="small">
            <VLText>Primary S</VLText>
          </Button>
          <Button state="success" size="medium">
            <VLText>Success M</VLText>
          </Button>
          <Button state="danger" size="large">
            <VLText>Danger L</VLText>
          </Button>
        </Row>
        <View style={{ height: 8 }} />
        <Row>
          <Button state="secondary" size="small">
            <VLText>Secondary S</VLText>
          </Button>
          <Button state="primary" size="large">
            <VLText>Primary L</VLText>
          </Button>
        </Row>
      </Section>

      {/* 6 – Interactive state switching */}
      <Section
        title="6. Interactive State Switch"
        note="Tap to cycle through button states"
      >
        <Button state={activeState} size="large">
          <VLText>{activeState.toUpperCase()}</VLText>
        </Button>
        <View style={{ height: 8 }} />
        <Row>
          {(['primary', 'secondary', 'success', 'danger'] as const).map((s) => (
            <Pressable
              key={s}
              style={[
                styles.stateBtn,
                activeState === s && styles.stateBtnActive,
              ]}
              onPress={() => setActiveState(s)}
            >
              <Text
                style={[
                  styles.stateBtnText,
                  activeState === s && styles.stateBtnTextActive,
                ]}
              >
                {s}
              </Text>
            </Pressable>
          ))}
        </Row>
      </Section>

      {/* 7 – Avatar with states + sizes */}
      <Section title="7. Avatar" note="Combining states (color) + sizes">
        <Row>
          <Avatar state="blue" size="small">
            <VLText>AB</VLText>
          </Avatar>
          <Avatar state="green" size="medium">
            <VLText>CD</VLText>
          </Avatar>
          <Avatar state="red" size="large">
            <VLText>EF</VLText>
          </Avatar>
          <Avatar state="purple" size="large">
            <VLText>GH</VLText>
          </Avatar>
        </Row>
      </Section>

      {/* 8 – Divider */}
      <Section title="8. Divider" note="Simple themed component">
        <VLText>Content above</VLText>
        <Divider />
        <VLText>Content below</VLText>
      </Section>

      {/* 9 – Tags */}
      <Section title="9. Tags" note="Label states with uppercase + colors">
        <Row>
          <Tag state="new">
            <VLText>New</VLText>
          </Tag>
          <Tag state="hot">
            <VLText>Hot</VLText>
          </Tag>
          <Tag state="beta">
            <VLText>Beta</VLText>
          </Tag>
          <Tag state="deprecated">
            <VLText>Deprecated</VLText>
          </Tag>
        </Row>
      </Section>

      {/* 10 – Composition */}
      <Section
        title="10. Composition"
        note="Building a card layout from rocketstyle primitives"
      >
        <Card variant="elevated">
          <View style={styles.composedRow}>
            <Avatar state="blue" size="medium">
              <VLText>JD</VLText>
            </Avatar>
            <View style={styles.composedContent}>
              <VLText>John Doe</VLText>
              <Row>
                <Tag state="new">
                  <VLText>New</VLText>
                </Tag>
                <StatusBadge state="success">
                  <VLText>Active</VLText>
                </StatusBadge>
              </Row>
            </View>
          </View>
          <Divider />
          <VLText>
            A composed card using Avatar, Tag, StatusBadge and Divider — all
            rocketstyle components.
          </VLText>
        </Card>
      </Section>

      <View style={styles.spacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  sectionNote: { fontSize: 12, color: '#888', marginBottom: 10 },
  sectionBody: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  stateBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  stateBtnActive: { backgroundColor: '#0070f3' },
  stateBtnText: { fontSize: 13, fontWeight: '600', color: '#555' },
  stateBtnTextActive: { color: '#fff' },
  composedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  composedContent: { flex: 1, gap: 6 },
  spacer: { height: 60 },
})
