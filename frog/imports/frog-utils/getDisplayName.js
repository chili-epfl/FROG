// @flow

export const getDisplayName = (WrappedComponent: any): string => {
  if (!WrappedComponent) return 'UndefinedComponent';
  if (typeof WrappedComponent.displayName === 'string') {
    return WrappedComponent.displayName;
  } else if (typeof WrappedComponent.name === 'string') {
    return WrappedComponent.name;
  } else {
    return 'Component';
  }
};
