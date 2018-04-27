export const color = (c: string) => {
  switch (c) {
    case 'map':
      return '#d7191c';
    case 'command':
      return '#fdae61';
    case 'form':
      return '#008837';
    case 'dragdrop':
      return '#2c7bb6';
    default:
      break;
  }
};

export const div = (x, y) => (Number.isFinite(x / y) ? x / y : 0);
