// @flow

export type AnchorT = {
  X: number,
  Y: number,
  dX: number,
  dY: number
};

// parameters for the curviness of the connections
const CURVINESS = 50;

export const drawPath = ({
  dragging,
  source,
  target
}: {
  dragging: boolean,
  source: AnchorT,
  target: AnchorT
}) => {
  if (dragging) {
    return ['M', source.X, source.Y, 'L', target.X, target.Y].join(' ');
  }

  return ['M', source.X, source.Y, 'C']
    .concat(
      Math.abs(source.Y - target.Y) < 5
        ? [
            source.X - CURVINESS,
            source.Y - CURVINESS,
            target.X + CURVINESS,
            target.Y - CURVINESS
          ]
        : [
            source.X + source.dX,
            source.Y + source.dY,
            target.X + target.dX,
            target.Y + target.dY
          ]
    )
    .concat([target.X, target.Y])
    .join(' ');
};

export const getMiddle = ({ source, target }: Object) => {
  if (Math.abs(source.Y - target.Y) < 5) {
    const [X1, X2] = [source.X, source.X - CURVINESS];
    const [X4, X3] = [target.X, target.X + CURVINESS];
    const [Y1, Y2] = [source.Y, source.Y - CURVINESS];
    const [Y4, Y3] = [target.Y, target.Y - CURVINESS];
    const x = (X1 + 3 * X2 + 3 * X3 + X4) / 8;
    const y = (Y1 + 3 * Y2 + 3 * Y3 + Y4) / 8;
    return [x, y];
  } else {
    const [X1, X2] = [source.X, source.X + source.dX];
    const [X4, X3] = [target.X, target.X + target.dX];
    const [Y1, Y2] = [source.Y, source.Y + source.dY];
    const [Y4, Y3] = [target.Y, target.Y + target.dY];
    const x = (X1 + 3 * X2 + 3 * X3 + X4) / 8;
    const y = (Y1 + 3 * Y2 + 3 * Y3 + Y4) / 8;
    return [x, y];
  }
};
