/* eslint-disable no-underscore-dangle */

export default (params = {}) => {
  if (window) {
    window.__ROCKETSTYLE_CONFIG__ = params;
  }

  if (global) {
    global.__ROCKETSTYLE_CONFIG__ = params;
  }
};
