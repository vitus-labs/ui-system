const rootSize = 16;
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

export default {
  // --------------------------------------------------------------------------
  // GENERAL SETTINGS
  // --------------------------------------------------------------------------
  isDark: true,
  rootSize,
  breakpoints,

  // --------------------------------------------------------------------------
  // SPACING, BORDERS, etc.
  // --------------------------------------------------------------------------
  spacing: {
    reset: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    base: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // --------------------------------------------------------------------------
  // FONTS
  // --------------------------------------------------------------------------
  fontFamily: {
    base: `"Basier Square",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      "Helvetica Neue",
      Arial,
      sans-serif,
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji"
    `,
    monospace:
      'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  lineHeight: {
    reset: 1,
    md: 1.2,
    base: 1.5,
  },
  fontSize: {
    xs: 12,
    sm: 13,
    md: 15,
    base: 16,
    lg: 20,
    xl: 24,
  },
  fontWeight: {
    thin: 200,
    light: 300,
    base: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    lighter: "lighter",
    bolder: "bolder",
  },

  // --------------------------------------------------------------------------
  // COLORS
  // --------------------------------------------------------------------------
  channelColor: {
    blue: {
      base: "#378BE7",
      medium: "rgba(55, 139, 231, 0.4)",
      light: "rgba(55, 139, 231, 0.4)",
    },
    orange: {
      base: "#FF764A",
      medium: "rgba(255, 118, 74, 0.4)",
      light: "rgba(255, 118, 74, 0.2)",
    },
    green: {
      base: "#7DCC3C",
      medium: "rgba(125, 204, 60, 0.4)",
      light: "rgba(125, 204, 60, 0.2)",
    },
    yellow: {
      base: "#FEB611",
      medium: "rgba(254, 182, 17, 0.4)",
      light: "rgba(254, 182, 17, 0.2)",
    },
    pink: {
      base: "#F092AF",
      medium: "rgba(240, 146, 175, 0.4)",
      light: "rgba(240, 146, 175, 0.2)",
    },
  },
  color: {
    transparent: "transparent",
    white: {
      base: "#fff",
      100: "#F2F2F7",
      200: "#E5E5EA",
      300: "#AEAEB2",
      400: "#8E8E93",
    },
    black: {
      base: "#000",
      100: "#202020",
      200: "#3A3A3C",
      300: "#48484A",
      400: "#636366",
    },
    // DEFAULT LIGHT THEME
    // primary: {
    //   base: '#000',
    //   medium: 'rgba(0,0,0,0.4)',
    //   light: 'rgba(0,0,0,0.2)',
    // },

    // DEFAULT DARK THEME
    // primary: {
    //   base: '#FFFFFF',
    //   medium: 'rgba(255,255,255,0.4)',
    //   light: 'rgba(255,255,255,0.2)',
    // },

    // DEFAULT CHANNEL COLOR (in production generated automatically)
    primary: {
      base: "#FF764A",
      medium: "rgba(255, 118, 74, 0.4)",
      light: "rgba(255, 118, 74, 0.2)",
    },
    // This color is being used for money related stuff
    money: {
      base: "#7DCC3C",
    },
    focus: {
      base: "#FF764A",
    },
    error: {
      base: "#FF453A",
    },
  },

  // --------------------------------------------------------------------------
  // BORDERS, etc.
  // --------------------------------------------------------------------------
  borderWidth: {
    reset: 0,
    base: 1,
    bolder: 2,
  },
  borderStyle: "solid",
  borderRadius: { sm: 4, md: 7, base: 14, circle: "50%", extra: 160 },

  // --------------------------------------------------------------------------
  // SHADOWS, etc.
  // --------------------------------------------------------------------------
  shadow: {
    white: {
      base: `0px 0px 10px rgba(123, 123, 123, 0.2);`,
    },
    black: {
      base: `0px 0px 10px rgba(0, 0, 0, 0.2);`,
    },
  },

  // --------------------------------------------------------------------------
  // ANIMATIONS, etc.
  // --------------------------------------------------------------------------
  transition: {
    base: "0.2s ease-in-out",
  },

  // --------------------------------------------------------------------------
  // ZINDEX, etc.
  // --------------------------------------------------------------------------
  zIndex: {
    alpha: 200,
  },
};
