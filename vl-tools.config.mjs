export default {
  build: {
    external: ['react/jsx-runtime'],
    globals: {
      React: 'react',
      ReactDOM: 'react-dom',
      ReactIs: 'react-is',
      hoistNonReactStatics: 'hoist-non-react-statics',
      lodashEs: 'lodash-es',
      moize: 'moize',
      attrs: '@vitus-labs/attrs',
      coolgrid: '@vitus-labs/coolgrid',
      core: '@vitus-labs/core',
      elements: '@vitus-labs/elements',
      rocketstyle: '@vitus-labs/rocketstyle',
      unistyle: '@vitus-labs/unistyle',
    },
  },
  stories: {
    styles: 'styled-components',
    font: 'https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap',
    decorators: {
      theme: {
        rootSize: 16,
        breakpoints: {
          xs: 0,
          sm: 576,
          md: 768,
          lg: 992,
          xl: 1200,
        },
        grid: {
          columns: 12,
          container: {
            xs: '100%',
            sm: 540,
            md: 720,
            lg: 960,
            xl: 1140,
          },
        },
      },
    },
  },
}
