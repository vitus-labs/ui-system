// export default from './storybook'

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

// "@storybook/addon-actions": "^5.3.17",
// "@storybook/addon-links": "^5.3.17",
// "@storybook/addons": "^5.3.17",
// "@storybook/react-native": "^5.3.17",
// "@storybook/react-native-server": "^5.3.17",
