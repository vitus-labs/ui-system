import createConfig from '../../vitest.shared'

// Recipe pulls @vitus-labs/unistyle through Element rendering at test time;
// unistyle's source uses the __WEB__/__NATIVE__ build-time flags, so they
// need to resolve under jsdom too.
export default createConfig({
  name: 'recipe',
  define: { __WEB__: true, __NATIVE__: false },
})
