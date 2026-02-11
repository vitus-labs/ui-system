import createConfig from '../../vitest.shared'

export default createConfig({
  name: 'rocketstyle',
  define: { __WEB__: true, __NATIVE__: false },
})
