import { Col, Container, Row } from '@vitus-labs/coolgrid'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const Cell = ({
  color,
  label,
}: { color: string; label: string }) => (
  <View style={[styles.cell, { backgroundColor: color }]}>
    <Text style={styles.cellText}>{label}</Text>
  </View>
)

export default function CoolgridScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Coolgrid (React Native)</Text>
      <Text style={styles.subtitle}>
        Grid system using onLayout width measurement
      </Text>

      <Text style={styles.sectionTitle}>1. Two equal columns</Text>
      <Container columns={12}>
        <Row>
          <Col size={6}>
            <Cell color="#0070f3" label="Col 6" />
          </Col>
          <Col size={6}>
            <Cell color="#e74c3c" label="Col 6" />
          </Col>
        </Row>
      </Container>

      <Text style={styles.sectionTitle}>2. Three columns</Text>
      <Container columns={12}>
        <Row>
          <Col size={4}>
            <Cell color="#2ecc71" label="Col 4" />
          </Col>
          <Col size={4}>
            <Cell color="#3498db" label="Col 4" />
          </Col>
          <Col size={4}>
            <Cell color="#9b59b6" label="Col 4" />
          </Col>
        </Row>
      </Container>

      <Text style={styles.sectionTitle}>3. Unequal columns with gap</Text>
      <Container columns={12} gap={8}>
        <Row>
          <Col size={3}>
            <Cell color="#e67e22" label="3" />
          </Col>
          <Col size={6}>
            <Cell color="#1abc9c" label="6" />
          </Col>
          <Col size={3}>
            <Cell color="#e74c3c" label="3" />
          </Col>
        </Row>
      </Container>

      <Text style={styles.sectionTitle}>4. Stacked rows</Text>
      <Container columns={12} gap={8}>
        <Row>
          <Col size={12}>
            <Cell color="#34495e" label="Full width" />
          </Col>
        </Row>
        <Row>
          <Col size={8}>
            <Cell color="#2980b9" label="Col 8" />
          </Col>
          <Col size={4}>
            <Cell color="#8e44ad" label="Col 4" />
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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cellText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  spacer: {
    height: 40,
  },
})
