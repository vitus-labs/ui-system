// Externalize @vitus-labs/unistyle at bundle time. recipe() imports
// makeItResponsive from unistyle to serialize variant themes into CSS, but
// rocketstyle as a package declares no runtime relationship to unistyle —
// it's pure multi-state component machinery. Consumers using recipe()
// install @vitus-labs/unistyle alongside rocketstyle; consumers using the
// chain API directly never pay that cost.
export default {
  build: {
    external: ['@vitus-labs/unistyle'],
  },
}
