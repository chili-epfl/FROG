// @flow

import React from 'react';

import { NavLi } from './StyledComponents';

export default ({ config, data }: Object) => {
  const genTitle = (
    part: string,
    index: number,
    current: number,
    conf: Object
  ) => {
    const res = 'Part ' + index + ': ' + part;
    switch (part) {
      case 'Examples':
        return res.concat(' (' + (current + 1) + '/' + conf.nbExamples + ')');
      case 'Tests with feedback':
        return res.concat(
          ' (' + (current + 1) + '/' + conf.nbTestFeedback + ')'
        );
      case 'Tests':
        return res.concat(' (' + (current + 1) + '/' + conf.nbTest + ')');
      default:
        return res;
    }
  };

  return (
    <ul className="nav nav-tabs">
      {data.parts &&
        data.parts.map((x, i) => (
          <NavLi
            key={x + i.toString()}
            className={data.indexPart === i ? 'active' : ''}
            style={{ width: 100 / data.parts.length + '%' }}
          >
            <a
              style={{
                backgroundColor: data.indexPart === i ? '#A0A0F0' : '',
                color: 'black'
              }}
            >
              {data.indexPart === i
                ? genTitle(x, i, data.indexCurrent, config)
                : 'Part ' + i + ': ' + x}
            </a>
          </NavLi>
        ))}
    </ul>
  );
};
