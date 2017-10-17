// @flow

export type AnchorT = {
  X: number,
  Y: number,
  dX: number,
  dY: number
};

export const drawPath = ({
  dragging,
  source,
  target
}: {
  dragging: boolean,
  source: AnchorT,
  target: AnchorT
}) => {
  // parameters for the curviness of the connections
  const q = 50;
  // parameter for the over bug (mouse can be over the connection while it is also over the activity, so onleave tiggers wrongly)
  const o = 5;

  if (dragging) {
    return ['M', source.X, source.Y, 'L', target.X - o, target.Y].join(' ');
  }

  return ['M', source.X, source.Y, 'C']
    .concat(
      Math.abs(source.Y - target.Y) < 5
        ? [source.X - q, source.Y - q, target.X + q, target.Y - q]
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
