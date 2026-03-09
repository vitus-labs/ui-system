import { Col, Container, Row } from '@vitus-labs/coolgrid'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

// ---- Reusable cell component ----
const Cell = ({
  color,
  label,
  height,
}: { color: string; label: string; height?: number }) => (
  <View
    style={[
      styles.cell,
      { backgroundColor: color, minHeight: height ?? 50 },
    ]}
  >
    <Text style={styles.cellText}>{label}</Text>
  </View>
)

// ---- Color palette ----
const C = {
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
}

export default function CoolgridScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Coolgrid Examples</Text>
      <Text style={styles.subtitle}>
        Responsive grid system for React Native
      </Text>

      {/* 1. Two equal columns */}
      <Text style={styles.sectionTitle}>1. Two Equal Columns</Text>
      <Container columns={12}>
        <Row>
          <Col size={6}>
            <Cell color={C.blue} label="6/12" />
          </Col>
          <Col size={6}>
            <Cell color={C.red} label="6/12" />
          </Col>
        </Row>
      </Container>

      {/* 2. Three equal columns */}
      <Text style={styles.sectionTitle}>2. Three Equal Columns</Text>
      <Container columns={12}>
        <Row>
          <Col size={4}>
            <Cell color={C.green} label="4/12" />
          </Col>
          <Col size={4}>
            <Cell color={C.purple} label="4/12" />
          </Col>
          <Col size={4}>
            <Cell color={C.orange} label="4/12" />
          </Col>
        </Row>
      </Container>

      {/* 3. Four equal columns */}
      <Text style={styles.sectionTitle}>3. Four Equal Columns</Text>
      <Container columns={12}>
        <Row>
          <Col size={3}>
            <Cell color={C.teal} label="3" />
          </Col>
          <Col size={3}>
            <Cell color={C.pink} label="3" />
          </Col>
          <Col size={3}>
            <Cell color={C.indigo} label="3" />
          </Col>
          <Col size={3}>
            <Cell color={C.cyan} label="3" />
          </Col>
        </Row>
      </Container>

      {/* 4. Unequal columns — sidebar layout */}
      <Text style={styles.sectionTitle}>4. Sidebar Layout (3 + 9)</Text>
      <Container columns={12}>
        <Row>
          <Col size={3}>
            <Cell color={C.indigo} label="Sidebar" height={100} />
          </Col>
          <Col size={9}>
            <Cell color={C.blue} label="Main Content" height={100} />
          </Col>
        </Row>
      </Container>

      {/* 5. With gap */}
      <Text style={styles.sectionTitle}>5. With Gap (8px)</Text>
      <Container columns={12} gap={8}>
        <Row>
          <Col size={4}>
            <Cell color={C.green} label="4" />
          </Col>
          <Col size={4}>
            <Cell color={C.purple} label="4" />
          </Col>
          <Col size={4}>
            <Cell color={C.orange} label="4" />
          </Col>
        </Row>
      </Container>

      {/* 6. Larger gap */}
      <Text style={styles.sectionTitle}>6. Large Gap (16px)</Text>
      <Container columns={12} gap={16}>
        <Row>
          <Col size={6}>
            <Cell color={C.cyan} label="6" />
          </Col>
          <Col size={6}>
            <Cell color={C.pink} label="6" />
          </Col>
        </Row>
      </Container>

      {/* 7. Multiple rows with gutter */}
      <Text style={styles.sectionTitle}>7. Multiple Rows + Gutter (12px)</Text>
      <Container columns={12} gap={8} gutter={12}>
        <Row>
          <Col size={6}>
            <Cell color={C.blue} label="Row 1 - Col A" />
          </Col>
          <Col size={6}>
            <Cell color={C.red} label="Row 1 - Col B" />
          </Col>
        </Row>
        <Row>
          <Col size={4}>
            <Cell color={C.green} label="Row 2 - A" />
          </Col>
          <Col size={4}>
            <Cell color={C.purple} label="Row 2 - B" />
          </Col>
          <Col size={4}>
            <Cell color={C.orange} label="Row 2 - C" />
          </Col>
        </Row>
        <Row>
          <Col size={12}>
            <Cell color={C.teal} label="Row 3 - Full Width" />
          </Col>
        </Row>
      </Container>

      {/* 8. Six equal columns */}
      <Text style={styles.sectionTitle}>8. Six Equal Columns</Text>
      <Container columns={6}>
        <Row>
          <Col size={1}>
            <Cell color={C.blue} label="1" />
          </Col>
          <Col size={1}>
            <Cell color={C.red} label="1" />
          </Col>
          <Col size={1}>
            <Cell color={C.green} label="1" />
          </Col>
          <Col size={1}>
            <Cell color={C.purple} label="1" />
          </Col>
          <Col size={1}>
            <Cell color={C.orange} label="1" />
          </Col>
          <Col size={1}>
            <Cell color={C.teal} label="1" />
          </Col>
        </Row>
      </Container>

      {/* 9. Auto-grow columns (no size = flex) */}
      <Text style={styles.sectionTitle}>9. Auto-Grow (No Size Prop)</Text>
      <Container columns={12}>
        <Row>
          <Col>
            <Cell color={C.amber} label="Auto" />
          </Col>
          <Col>
            <Cell color={C.lime} label="Auto" />
          </Col>
          <Col>
            <Cell color={C.brown} label="Auto" />
          </Col>
        </Row>
      </Container>

      {/* 10. Mixed: fixed + auto */}
      <Text style={styles.sectionTitle}>10. Mixed: Fixed + Auto</Text>
      <Container columns={12}>
        <Row>
          <Col size={4}>
            <Cell color={C.indigo} label="Fixed 4" />
          </Col>
          <Col>
            <Cell color={C.cyan} label="Auto fill" />
          </Col>
        </Row>
      </Container>

      {/* 11. Holy grail layout */}
      <Text style={styles.sectionTitle}>11. Holy Grail Layout</Text>
      <Container columns={12} gap={8}>
        <Row>
          <Col size={12}>
            <Cell color={C.indigo} label="Header" />
          </Col>
        </Row>
        <Row>
          <Col size={3}>
            <Cell color={C.pink} label="Nav" height={120} />
          </Col>
          <Col size={6}>
            <Cell color={C.blue} label="Content" height={120} />
          </Col>
          <Col size={3}>
            <Cell color={C.teal} label="Aside" height={120} />
          </Col>
        </Row>
        <Row>
          <Col size={12}>
            <Cell color={C.brown} label="Footer" />
          </Col>
        </Row>
      </Container>

      {/* 12. Dashboard cards */}
      <Text style={styles.sectionTitle}>12. Dashboard Cards</Text>
      <Container columns={12} gap={8} gutter={8}>
        <Row>
          <Col size={6}>
            <Cell color={C.blue} label="Revenue" height={80} />
          </Col>
          <Col size={6}>
            <Cell color={C.green} label="Users" height={80} />
          </Col>
        </Row>
        <Row>
          <Col size={4}>
            <Cell color={C.purple} label="CPU" height={60} />
          </Col>
          <Col size={4}>
            <Cell color={C.orange} label="Memory" height={60} />
          </Col>
          <Col size={4}>
            <Cell color={C.red} label="Disk" height={60} />
          </Col>
        </Row>
        <Row>
          <Col size={8}>
            <Cell color={C.indigo} label="Chart" height={100} />
          </Col>
          <Col size={4}>
            <Cell color={C.teal} label="Activity" height={100} />
          </Col>
        </Row>
      </Container>

      {/* 13. Asymmetric columns */}
      <Text style={styles.sectionTitle}>13. Asymmetric (1+2+3+6)</Text>
      <Container columns={12} gap={4}>
        <Row>
          <Col size={1}>
            <Cell color={C.red} label="1" />
          </Col>
          <Col size={2}>
            <Cell color={C.orange} label="2" />
          </Col>
          <Col size={3}>
            <Cell color={C.green} label="3" />
          </Col>
          <Col size={6}>
            <Cell color={C.blue} label="6" />
          </Col>
        </Row>
      </Container>

      {/* 14. Nested grids */}
      <Text style={styles.sectionTitle}>14. Nested Grid</Text>
      <Container columns={12} gap={8}>
        <Row>
          <Col size={6}>
            <Cell color={C.indigo} label="Left" height={40} />
          </Col>
          <Col size={6}>
            <Container columns={2} gap={4}>
              <Row>
                <Col size={1}>
                  <Cell color={C.pink} label="A" />
                </Col>
                <Col size={1}>
                  <Cell color={C.teal} label="B" />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>

      {/* 15. Photo gallery grid */}
      <Text style={styles.sectionTitle}>15. Photo Gallery (4x3)</Text>
      <Container columns={4} gap={4} gutter={4}>
        <Row>
          <Col size={1}>
            <Cell color="#e57373" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#f06292" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#ba68c8" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#9575cd" label="" height={70} />
          </Col>
        </Row>
        <Row>
          <Col size={1}>
            <Cell color="#7986cb" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#64b5f6" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#4fc3f7" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#4dd0e1" label="" height={70} />
          </Col>
        </Row>
        <Row>
          <Col size={1}>
            <Cell color="#4db6ac" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#81c784" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#aed581" label="" height={70} />
          </Col>
          <Col size={1}>
            <Cell color="#dce775" label="" height={70} />
          </Col>
        </Row>
      </Container>

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
  cell: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cellText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  spacer: {
    height: 60,
  },
})
