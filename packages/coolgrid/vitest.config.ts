import createConfig from '../../vitest.shared.ts'

export default createConfig({
  name: 'coolgrid',
  define: { __WEB__: true, __NATIVE__: false },
})
