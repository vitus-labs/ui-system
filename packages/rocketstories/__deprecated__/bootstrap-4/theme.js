export default {
  // --------------------------------------------------------------------------
  // GENERAL SETTINGS
  // --------------------------------------------------------------------------
  rootSize: 16,
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
  // --------------------------------------------------------------------------
  // FONTS
  // --------------------------------------------------------------------------
  fontFamily: {
    base: `-apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji"`,
    monospace:
      'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  lineHeight: 1.5,

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 20,
    xl: 24,
    smaller: '87.5%',
    smallest: '75%'
  },

  fontWeight: {
    thin: 200,
    light: 300,
    base: 400,
    medium: 500,
    bold: 700,
    lighter: 'lighter',
    bolder: 'bolder'
  },

  // --------------------------------------------------------------------------
  // COLORS
  // --------------------------------------------------------------------------
  color: {
    transparent: 'transparent',
    white: '#fff',
    gray100: '#f8f9fa',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ced4da',
    gray500: '#adb5bd',
    gray600: '#6c757d',
    gray700: '#495057',
    gray800: '#343a40',
    gray900: '#212529',
    black: '#000',

    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    info: '#17a2b8',
    warning: '#ffc107',
    danger: '#dc3545',
    light: '#f8f9fa',
    dark: '#343a40'
  },

  // --------------------------------------------------------------------------
  // SPACING, BORDERS, etc.
  // --------------------------------------------------------------------------
  spacing: {
    reset: 0,
    xxs: 3,
    xs: 4,
    xsm: 6,
    sm: 8,
    base: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },

  borderWidth: 1,
  get borderColor() {
    return this.color.gray300
  },

  borderRadius: { sm: 3, base: 4, lg: 5, circle: '50%', extra: 160 },

  boxShadow: {
    sm: `0 .125rem .25rem`,
    base: `0 .5rem 1rem`,
    lg: `0 1rem 3rem`
  },

  // --------------------------------------------------------------------------
  // SHADOWS, ANIMATIONS, etc.
  // --------------------------------------------------------------------------
  get boxShadowSm() {
    return `0 .125rem .25rem rgba(${this.color.black}, .075)`
  },
  get boxShadow() {
    return `0 .5rem 1rem rgba(${this.color.black}, .15)`
  },
  get boxShadowLg() {
    return `0 1rem 3rem rgba(${this.color.black}, .175)`
  },

  transitionBase: 'all .2s ease-in-out',
  transitionFade: 'opacity .15s linear',
  transitionCollapse: 'height .35s ease'
}

// const grayScaleColors = {
//   white: '#fff',
//   gray100: '#f8f9fa',
//   gray200: '#e9ecef',
//   gray300: '#dee2e6',
//   gray400: '#ced4da',
//   gray500: '#adb5bd',
//   gray600: '#6c757d',
//   gray700: '#495057',
//   gray800: '#343a40',
//   gray900: '#212529'
// }

// const basicColors = {
//   transparent: 'transparent',
//   black: '#000',
//   blue: '#007bff',
//   indigo: '#6610f2',
//   purple: '#6f42c1',
//   pink: '#e83e8c',
//   red: '#dc3545',
//   orange: '#fd7e14',
//   yellow: '#ffc107',
//   green: '#28a745',
//   teal: '#20c997',
//   cyan: '#17a2b8'
// }
