import { attrs, isAttrsComponent } from '@vitus-labs/attrs'
import { Element, Text as VLText } from '@vitus-labs/elements'
import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

// ═══════════════════════════════════════════════════════════════════════
// 1. Basic attrs — static defaults
// ═══════════════════════════════════════════════════════════════════════
const Box = attrs({ name: 'Box', component: Element }).attrs({
  direction: 'rows',
  alignX: 'center',
  alignY: 'center',
  block: true,
})

// ═══════════════════════════════════════════════════════════════════════
// 2. Chained .attrs() — defaults stack left-to-right
// ═══════════════════════════════════════════════════════════════════════
const Badge = attrs({ name: 'Badge', component: Element })
  .attrs({
    direction: 'inline',
    alignX: 'center',
    alignY: 'center',
  })
  .attrs({
    // second call overrides / extends
    gap: 4,
  })

// ═══════════════════════════════════════════════════════════════════════
// 3. Callback attrs — computed from props
// ═══════════════════════════════════════════════════════════════════════
const ColorBox = attrs({ name: 'ColorBox', component: Element }).attrs<{
  variant?: 'primary' | 'success' | 'danger'
}>((props) => {
  const colors = {
    primary: '#0070f3',
    success: '#2ecc71',
    danger: '#e74c3c',
  }
  return {
    direction: 'inline' as const,
    alignX: 'center' as const,
    alignY: 'center' as const,
    // use the variant prop to pick a color, default to primary
    label: colors[props.variant ?? 'primary'],
  }
})

// ═══════════════════════════════════════════════════════════════════════
// 4. Priority attrs — cannot be overridden by consumer props
// ═══════════════════════════════════════════════════════════════════════
const LockedDirection = attrs({
  name: 'LockedDirection',
  component: Element,
})
  .attrs({ direction: 'rows' }, { priority: true })
  .attrs({ alignX: 'center', alignY: 'center', gap: 8, block: true })

// ═══════════════════════════════════════════════════════════════════════
// 5. Filter — strip internal props before passing to wrapped component
// ═══════════════════════════════════════════════════════════════════════
const FilteredBox = attrs({ name: 'FilteredBox', component: Element })
  .attrs<{ mood?: 'happy' | 'sad' }>(
    (props) => ({
      direction: 'inline' as const,
      alignX: 'center' as const,
      alignY: 'center' as const,
      label: props.mood === 'happy' ? '😄' : '😢',
    }),
    { filter: ['mood'] }, // 'mood' won't be forwarded to Element
  )

// ═══════════════════════════════════════════════════════════════════════
// 6. .config() — rename / swap base component
// ═══════════════════════════════════════════════════════════════════════
const Card = Box.config({ name: 'Card' }).attrs({
  gap: 8,
})

const InfoCard = Card.config({ name: 'InfoCard' }).attrs({
  gap: 12,
})

// ═══════════════════════════════════════════════════════════════════════
// 7. .statics() — attach metadata
// ═══════════════════════════════════════════════════════════════════════
const MetaBox = attrs({ name: 'MetaBox', component: Element })
  .attrs({ direction: 'rows', block: true })
  .statics({
    category: 'layout',
    version: '2.0',
    tags: ['box', 'container'],
  })

// ═══════════════════════════════════════════════════════════════════════
// 8. .compose() — wrap with HOCs
// ═══════════════════════════════════════════════════════════════════════
const withBorder =
  (Component: React.ComponentType<any>) => (props: any) => (
    <View
      style={{
        borderWidth: 2,
        borderColor: '#0070f3',
        borderRadius: 8,
        borderStyle: 'dashed',
      }}
    >
      <Component {...props} />
    </View>
  )

const withBackground =
  (Component: React.ComponentType<any>) => (props: any) => (
    <View style={{ backgroundColor: '#e8f4fd', borderRadius: 8 }}>
      <Component {...props} />
    </View>
  )

const ComposedBox = attrs({ name: 'ComposedBox', component: Element })
  .attrs({ direction: 'rows', alignX: 'center', gap: 8, block: true })
  .compose({ withBorder, withBackground })

// ═══════════════════════════════════════════════════════════════════════
// 9. Branching — immutable chain allows reuse
// ═══════════════════════════════════════════════════════════════════════
const BaseButton = attrs({ name: 'BaseButton', component: Element }).attrs({
  direction: 'inline',
  alignX: 'center',
  alignY: 'center',
})

const PrimaryBtn = BaseButton.config({ name: 'PrimaryBtn' })
const SecondaryBtn = BaseButton.config({ name: 'SecondaryBtn' })
const GhostBtn = BaseButton.config({ name: 'GhostBtn' })

// ═══════════════════════════════════════════════════════════════════════
// 10. isAttrsComponent — runtime type guard
// ═══════════════════════════════════════════════════════════════════════
// (used in the demo below)

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

const Pill = ({
  label,
  color,
}: {
  label: string
  color: string
}) => (
  <View style={[styles.pill, { backgroundColor: color }]}>
    <Text style={styles.pillText}>{label}</Text>
  </View>
)

// ═══════════════════════════════════════════════════════════════════════
// Screen
// ═══════════════════════════════════════════════════════════════════════
export default function AttrsScreen() {
  const [variant, setVariant] = useState<'primary' | 'success' | 'danger'>(
    'primary',
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Attrs</Text>
      <Text style={styles.subtitle}>
        Chainable props composition for design-system primitives
      </Text>

      {/* 1 – Basic */}
      <Section title="1. Basic .attrs()" note="Static default props">
        <Box>
          <Pill label="A" color="#0070f3" />
          <Pill label="B" color="#e74c3c" />
          <Pill label="C" color="#2ecc71" />
        </Box>
      </Section>

      {/* 2 – Chained */}
      <Section title="2. Chained .attrs()" note="Multiple calls stack defaults">
        <Badge>
          <Pill label="Tag" color="#9b59b6" />
          <VLText>Inline badge with gap=4</VLText>
        </Badge>
      </Section>

      {/* 3 – Callback */}
      <Section
        title="3. Callback attrs"
        note="Compute defaults from consumer props"
      >
        <Row>
          {(['primary', 'success', 'danger'] as const).map((v) => (
            <Pressable key={v} onPress={() => setVariant(v)}>
              <View
                style={[
                  styles.variantBtn,
                  variant === v && styles.variantBtnActive,
                ]}
              >
                <Text style={styles.variantBtnText}>{v}</Text>
              </View>
            </Pressable>
          ))}
        </Row>
        <View style={{ height: 8 }} />
        <ColorBox variant={variant}>
          <View
            style={[
              styles.colorSwatch,
              {
                backgroundColor:
                  variant === 'primary'
                    ? '#0070f3'
                    : variant === 'success'
                      ? '#2ecc71'
                      : '#e74c3c',
              },
            ]}
          />
          <VLText>variant="{variant}"</VLText>
        </ColorBox>
      </Section>

      {/* 4 – Priority */}
      <Section
        title="4. Priority attrs"
        note='direction="rows" is locked — cannot be overridden'
      >
        {/* Even if consumer passes direction="inline", priority attrs wins */}
        <LockedDirection direction={'inline' as any}>
          <Pill label="1" color="#f39c12" />
          <Pill label="2" color="#1abc9c" />
          <Pill label="3" color="#e91e63" />
        </LockedDirection>
        <Text style={styles.detail}>
          ↑ direction="inline" was passed, but rows is locked via priority
        </Text>
      </Section>

      {/* 5 – Filter */}
      <Section
        title="5. Prop filtering"
        note='"mood" prop is used to compute label, then stripped'
      >
        <Row>
          <FilteredBox mood="happy">
            <VLText>Happy</VLText>
          </FilteredBox>
          <FilteredBox mood="sad">
            <VLText>Sad</VLText>
          </FilteredBox>
        </Row>
      </Section>

      {/* 6 – Config */}
      <Section
        title="6. .config()"
        note="Rename or swap the base component, preserving the chain"
      >
        <Card>
          <VLText>Card (renamed from Box, gap=8)</VLText>
        </Card>
        <View style={{ height: 8 }} />
        <InfoCard>
          <VLText>InfoCard (renamed from Card, gap=12)</VLText>
        </InfoCard>
        <Text style={styles.detail}>
          Box → Card → InfoCard — chain inheritance preserved
        </Text>
      </Section>

      {/* 7 – Statics */}
      <Section title="7. .statics()" note="Attach metadata via .meta">
        <View style={styles.codeBlock}>
          <Text style={styles.codeLine}>
            MetaBox.meta.category: "{MetaBox.meta.category}"
          </Text>
          <Text style={styles.codeLine}>
            MetaBox.meta.version: "{MetaBox.meta.version}"
          </Text>
          <Text style={styles.codeLine}>
            MetaBox.meta.tags: [{MetaBox.meta.tags.join(', ')}]
          </Text>
        </View>
      </Section>

      {/* 8 – Compose */}
      <Section title="8. .compose()" note="Wrap with HOCs (border + background)">
        <ComposedBox>
          <VLText>Content wrapped by two HOCs</VLText>
        </ComposedBox>
      </Section>

      {/* 9 – Branching */}
      <Section
        title="9. Immutable branching"
        note="Same base, different configs via .config()"
      >
        <Row>
          <PrimaryBtn>
            <View style={[styles.btnPill, { backgroundColor: '#0070f3' }]}>
              <Text style={styles.btnPillText}>Primary</Text>
            </View>
          </PrimaryBtn>
          <SecondaryBtn>
            <View style={[styles.btnPill, { backgroundColor: '#6c757d' }]}>
              <Text style={styles.btnPillText}>Secondary</Text>
            </View>
          </SecondaryBtn>
          <GhostBtn>
            <View
              style={[
                styles.btnPill,
                { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333' },
              ]}
            >
              <Text style={[styles.btnPillText, { color: '#333' }]}>Ghost</Text>
            </View>
          </GhostBtn>
        </Row>
        <Text style={styles.detail}>
          All three share BaseButton chain, branched via .config()
        </Text>
      </Section>

      {/* 10 – isAttrsComponent */}
      <Section
        title="10. isAttrsComponent()"
        note="Runtime type guard to detect attrs components"
      >
        <View style={styles.codeBlock}>
          <Text style={styles.codeLine}>
            isAttrsComponent(Box): {String(isAttrsComponent(Box))}
          </Text>
          <Text style={styles.codeLine}>
            isAttrsComponent(Element): {String(isAttrsComponent(Element))}
          </Text>
          <Text style={styles.codeLine}>
            isAttrsComponent(View): {String(isAttrsComponent(View))}
          </Text>
          <Text style={styles.codeLine}>
            isAttrsComponent("string"): {String(isAttrsComponent('string'))}
          </Text>
        </View>
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
  detail: { fontSize: 12, color: '#888', marginTop: 6 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  pillText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  variantBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  variantBtnActive: { backgroundColor: '#0070f3' },
  variantBtnText: { fontSize: 13, fontWeight: '600', color: '#333' },
  colorSwatch: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  codeBlock: {
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    padding: 12,
  },
  codeLine: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#333',
    lineHeight: 22,
  },
  btnPill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPillText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  spacer: { height: 60 },
})
