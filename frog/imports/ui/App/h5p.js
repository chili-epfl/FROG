/* eslint-disable */
// H5P iframe Resizer
export const H5PIframePrepare = () => {
  if (
    !window.postMessage ||
    !window.addEventListener ||
    window.h5pResizerInitialized
  ) {
    return; // Not supported
  }
  window.h5pResizerInitialized = true;

  // Map actions to handlers
  const actionHandlers = {};

  /**
   * Prepare iframe resize.
   *
   * @private
   * @param {Object} iframe Element
   * @param {Object} data Payload
   * @param {Function} respond Send a response to the iframe
   */
  actionHandlers.hello = function(iframe, data, respond) {
    // Make iframe responsive
    iframe.style.width = '100%';

    // Tell iframe that it needs to resize when our window resizes
    var resize = function(event) {
      if (iframe.contentWindow) {
        // Limit resize calls to avoid flickering
        respond('resize');
      } else {
        // Frame is gone, unregister.
        window.removeEventListener('resize', resize);
      }
    };
    window.addEventListener('resize', resize, false);

    // Respond to let the iframe know we can resize it
    respond('hello');
  };

  /**
   * Prepare iframe resize.
   *
   * @private
   * @param {Object} iframe Element
   * @param {Object} data Payload
   * @param {Function} respond Send a response to the iframe
   */
  actionHandlers.prepareResize = function(iframe, data, respond) {
    // Do not resize unless page and scrolling differs
    if (
      iframe.clientHeight !== data.scrollHeight ||
      data.scrollHeight !== data.clientHeight
    ) {
      // Reset iframe height, in case content has shrinked.
      iframe.style.height = data.clientHeight + 'px';
      respond('resizePrepared');
    }
  };

  /**
   * Resize parent and iframe to desired height.
   *
   * @private
   * @param {Object} iframe Element
   * @param {Object} data Payload
   * @param {Function} respond Send a response to the iframe
   */
  actionHandlers.resize = function(iframe, data, respond) {
    // Resize iframe so all content is visible. Use scrollHeight to make sure we get everything
    iframe.style.height = data.scrollHeight + 'px';
  };

  /**
   * Keyup event handler. Exits full screen on escape.
   *
   * @param {Event} event
   */
  const escape = function(event) {
    if (event.keyCode === 27) {
      exitFullScreen();
    }
  };

  // Listen for messages from iframes
  window.addEventListener(
    'message',
    event => {
      if (event.data.context !== 'h5p') {
        return; // Only handle h5p requests.
      }

      // Find out who sent the message
      let iframe,
        iframes = document.getElementsByTagName('iframe');
      for (let i = 0; i < iframes.length; i++) {
        if (iframes[i].contentWindow === event.source) {
          iframe = iframes[i];
          break;
        }
      }

      if (!iframe) {
        return; // Cannot find sender
      }

      // Find action handler handler
      if (actionHandlers[event.data.action]) {
        actionHandlers[event.data.action](
          iframe,
          event.data,
          (action, data) => {
            if (data === undefined) {
              data = {};
            }
            data.action = action;
            data.context = 'h5p';
            event.source.postMessage(data, event.origin);
          }
        );
      }
    },
    false
  );

  // Let h5p iframes know we're ready!
  const iframes = document.getElementsByTagName('iframe');
  const ready = {
    context: 'h5p',
    action: 'ready'
  };
  for (let i = 0; i < iframes.length; i++) {
    if (iframes[i].src.indexOf('h5p') !== -1) {
      iframes[i].contentWindow.postMessage(ready, '*');
    }
  }
};
