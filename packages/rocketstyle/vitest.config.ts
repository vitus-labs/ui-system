import createConfig from '../../vitest.shared.ts'

export default createConfig({
  name: 'rocketstyle',
  define: { __WEB__: true, __NATIVE__: false },
})
