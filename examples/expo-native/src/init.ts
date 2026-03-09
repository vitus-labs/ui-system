import { init } from '@vitus-labs/core'
import * as connector from '@vitus-labs/connector-native'
import { Text, View } from 'react-native'

init({
  ...connector,
  component: View,
  textComponent: Text,
})
