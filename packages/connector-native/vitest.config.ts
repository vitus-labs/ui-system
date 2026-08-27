import path from 'node:path'
import createConfig from '../../vitest.shared.ts'

const base = createConfig({ name: 'connector-native' })

export default {
  ...base,
  resolve: {
    ...base.resolve,
    alias: {
      ...(base.resolve as any)?.alias,
      'react-native': path.resolve(
        import.meta.dirname,
        'src/__mocks__/react-native.ts'
      ),
    },
  },
}
