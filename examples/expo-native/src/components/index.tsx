import type { ReactNode } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

// ─── Colors ─────────────────────────────────────────────────────────────
export const colors = {
  blue: '#0070f3',
  red: '#e74c3c',
  green: '#2ecc71',
  purple: '#9b59b6',
  orange: '#f39c12',
  teal: '#1abc9c',
  pink: '#e91e63',
  indigo: '#3f51b5',
  cyan: '#00bcd4',
  amber: '#ff9800',
  lime: '#cddc39',
  brown: '#795548',
  gray: '#6c757d',
} as const

// ─── Screen ─────────────────────────────────────────────────────────────
/** Page wrapper: ScrollView + title + subtitle + bottom spacer. */
export const Screen = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) => (
  <ScrollView style={s.screen}>
    <Text style={s.title}>{title}</Text>
    <Text style={s.subtitle}>{subtitle}</Text>
    {children}
    <View style={s.spacer} />
  </ScrollView>
)

// ─── Section ────────────────────────────────────────────────────────────
/** Titled section with optional description note. */
export const Section = ({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>{title}</Text>
    {note && <Text style={s.sectionNote}>{note}</Text>}
    {children}
  </View>
)

// ─── Card ───────────────────────────────────────────────────────────────
/** Rounded card with title, optional note, and body content. */
export const Card = ({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) => (
  <View style={s.card}>
    <Text style={s.cardTitle}>{title}</Text>
    {note && <Text style={s.cardNote}>{note}</Text>}
    <View style={s.cardBody}>{children}</View>
  </View>
)

// ─── Row ────────────────────────────────────────────────────────────────
/** Flex row with gap and wrap. */
export const Row = ({ children }: { children: ReactNode }) => (
  <View style={s.row}>{children}</View>
)

// ─── Gap ────────────────────────────────────────────────────────────────
/** Vertical spacer. */
export const Gap = ({ size = 8 }: { size?: number }) => (
  <View style={{ height: size }} />
)

// ─── Btn ────────────────────────────────────────────────────────────────
/** Small colored button. */
export const Btn = ({
  label,
  onPress,
  color = colors.blue,
}: {
  label: string
  onPress: () => void
  color?: string
}) => (
  <Pressable style={[s.btn, { backgroundColor: color }]} onPress={onPress}>
    <Text style={s.btnText}>{label}</Text>
  </Pressable>
)

// ─── Val ────────────────────────────────────────────────────────────────
/** Big value display. */
export const Val = ({ children }: { children: ReactNode }) => (
  <Text style={s.val}>{String(children)}</Text>
)

// ─── Detail ─────────────────────────────────────────────────────────────
/** Small muted text for notes/details. */
export const Detail = ({ children }: { children: ReactNode }) => (
  <Text style={s.detail}>{String(children)}</Text>
)

// ─── Cell ───────────────────────────────────────────────────────────────
/** Colored rounded box — for grid cells, pills, etc. */
export const Cell = ({
  color,
  label,
  height,
}: {
  color: string
  label: string
  height?: number
}) => (
  <View
    style={[s.cell, { backgroundColor: color, minHeight: height ?? 50 }]}
  >
    <Text style={s.cellText}>{label}</Text>
  </View>
)

// ─── CodeBlock ──────────────────────────────────────────────────────────
/** Monospace code display. */
export const CodeBlock = ({ children }: { children: ReactNode }) => (
  <View style={s.codeBlock}>{children}</View>
)

export const CodeLine = ({ children }: { children: ReactNode }) => (
  <Text style={s.codeLine}>{String(children)}</Text>
)

// ─── Styles ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Screen
  screen: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  spacer: { height: 60 },

  // Section
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 2 },
  sectionNote: { fontSize: 12, color: '#888', marginBottom: 10 },

  // Card
  card: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 2 },
  cardNote: { fontSize: 12, color: '#888' },
  cardBody: { marginTop: 8 },

  // Row
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },

  // Btn
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Val
  val: { fontSize: 20, fontWeight: '700', color: '#333' },

  // Detail
  detail: { fontSize: 14, color: '#555', marginBottom: 4 },

  // Cell
  cell: { padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 50 },
  cellText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // CodeBlock
  codeBlock: { backgroundColor: '#f4f4f5', borderRadius: 8, padding: 12 },
  codeLine: { fontFamily: 'monospace', fontSize: 13, color: '#333', lineHeight: 22 },
})
