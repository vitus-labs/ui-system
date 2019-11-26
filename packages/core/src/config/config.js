import styled, { withTheme, css, ThemeContext } from "styled-components";

global.__ROCKETSTYLE_CONFIG__ = {
  isWeb: true,
  platform: "web",
  css,
  styled,
  withTheme,
  context: ThemeContext,
  component: "div",
  textComponent: "p"
};

export default () => {
  const config = () => global.__ROCKETSTYLE_CONFIG__ || {};

  return {
    ...config()
  };
};
