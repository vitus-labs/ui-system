import '@testing-library/jest-dom/vitest'
import { init } from './packages/core/src/config'
import {
  ThemeProvider,
  createGlobalStyle,
  css,
  keyframes,
  styled,
  useTheme,
} from './packages/styler/src/index'

// Initialize the CSS-in-JS engine before any test modules load.
init({ css, styled, provider: ThemeProvider, keyframes, createGlobalStyle, useTheme })
