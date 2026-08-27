import createConfig from '../../vitest.shared.ts'

export default createConfig({
  name: 'elements',
  define: { __WEB__: true, __NATIVE__: false },
})
