import '../src/init'
import { Provider } from '@vitus-labs/core'
import { Stack } from 'expo-router'

const theme = {
  rootSize: 16,
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
}

export default function RootLayout() {
  return (
    <Provider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'VL Native Example' }} />
        <Stack.Screen name="coolgrid" options={{ title: 'Coolgrid' }} />
        <Stack.Screen name="kinetic" options={{ title: 'Kinetic' }} />
        <Stack.Screen name="hooks" options={{ title: 'Hooks' }} />
      </Stack>
    </Provider>
  )
}
