// @flow

const doesWindowObjExist = () => {
  try {
    return window !== undefined;
  } catch (e) {
    return false;
  }
};

export const isBrowser = doesWindowObjExist();
