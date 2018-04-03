// @flow

import * as React from 'react';
import { A } from 'frog-utils';

export default ({
  onClick,
  icon,
  color,
  tooltip
}: {
  onClick: Function,
  icon: string,
  color?: string,
  tooltip?: string
}) => (
  <span style={{ marginLeft: '10px' }}>
    <A onClick={onClick}>
      <i className={icon} style={{ color }} data-tip={tooltip} />
    </A>
  </span>
);
