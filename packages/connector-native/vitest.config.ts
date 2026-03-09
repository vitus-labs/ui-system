import path from 'node:path'
import createConfig from '../../vitest.shared'

const base = createConfig({ name: 'connector-native' })

export default {
  ...base,
  resolve: {
    ...base.resolve,
    alias: {
      ...(base.resolve as any)?.alias,
      'react-native': path.resolve(
        __dirname,
        'src/__mocks__/react-native.ts'
      ),
    },
  },
}
