// @flow

export const msToString = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const res =
    minutes > 0
      ? minutes + 'min ' + (Math.round(ms / 1000) - minutes * 60) + 's'
      : Math.round(ms / 1000) + 's';
  return res;
};
