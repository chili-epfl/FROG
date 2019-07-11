// @flow

export const getRotateable = (ary: *, toRotate?: number): * =>
  new Proxy(ary, {
    get: (obj, prop) => obj[(parseInt(prop, 10) + (toRotate || 0)) % obj.length]
  });
