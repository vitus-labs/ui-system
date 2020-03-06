import { theme as grid } from '@vitus-labs/coolgrid'

grid.grid.container.xs = '90%' // TODO: improve this mutation

export default {
  ...grid, // coolgrid config
  // --------------------------------------------------------------------------
  // FONTS
  // --------------------------------------------------------------------------
  fontFamily: {
    base: 'Ubuntu, sans-serif'
  },

  lineHeight: {
    xs: 1.1,
    sm: 1.3,
    base: 1.5,
    xl: 1.75
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 32,
    smaller: '87.5%',
    smallest: '75%'
  },

  fontWeight: {
    thin: 200,
    light: 300,
    base: 400,
    semibold: 600,
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
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayContent: 'rgba(0, 0, 0, 0.8)',

    primary: '#EB5757',
    secondary: '#696969', // 6c757d
    success: '#28a745',
    info: '#17a2b8',
    warning: '#ffc107',
    danger: '#EB5757',
    light: '#f8f9fa',
    dark: '#343a40',
    google: '#EB5757',
    facebook: '#2D9CDB'
  },

  // --------------------------------------------------------------------------
  // SPACING, BORDERS, etc.
  // --------------------------------------------------------------------------
  spacing: {
    reset: 0,
    xxs: 3.2,
    xs: 4,
    sm: 8,
    base: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },

  borderWidth: {
    base: 1,
    md: 2,
    xl: 4
  },
  get borderColor() {
    return this.color.gray300
  },

  borderRadius: {
    sm: 3.2,
    base: 4,
    lg: 4.8,
    xl: 8,
    xxl: 16,
    circle: '50%'
  },

  transition: {
    base: 'all 0.3s'
  },

  zIndex: {
    negative: -1,
    xs: 10,
    overlay: 1000,
    overlayContent: 1001
  }
}
