/* eslint-disable */
const extractVersion = (uastring, expr, pos) => {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
};

const detectBrowser = () => {
  const navigator = window && window.navigator;

  // Returned result object.
  const result = {};
  result.browser = null;
  result.version = null;

  // Fail early if it's not a browser
  if (typeof window === 'undefined' || !window.navigator) {
    result.browser = 'Not a browser.';
    return result;
  }

  if (navigator.mozGetUserMedia) {
    // Firefox.
    result.browser = 'firefox';
    result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
  } else if (navigator.webkitGetUserMedia) {
    // Chrome, Chromium, Webview, Opera.
    // Version matches Chrome/WebRTC version.
    result.browser = 'chrome';
    result.version = extractVersion(
      navigator.userAgent,
      /Chrom(e|ium)\/(\d+)\./,
      2
    );
  } else if (
    navigator.mediaDevices &&
    navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)
  ) {
    // Edge.
    result.browser = 'edge';
    result.version = extractVersion(
      navigator.userAgent,
      /Edge\/(\d+).(\d+)$/,
      2
    );
  } else if (
    window.RTCPeerConnection &&
    navigator.userAgent.match(/AppleWebKit\/(\d+)\./)
  ) {
    // Safari.
    result.browser = 'safari';
    result.version = extractVersion(
      navigator.userAgent,
      /AppleWebKit\/(\d+)\./,
      1
    );
  } else {
    // Default fallthrough: not supported.
    result.browser = 'Not a supported browser.';
    return result;
  }

  return result;
};

export default {
  detectBrowser
};
