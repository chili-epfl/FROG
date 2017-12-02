// @flow
import React from 'react';
import styled from 'styled-components';

const Quadrants = ({
  config,
  width,
  height
}: {
  config: Object,
  width: number,
  height: number
}) => {
  if (!width || !height) {
    return null;
  }
  return (
    <div>
      <Item
        group="a"
        key="a"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: height / 2,
          width: width / 2
        }}
      >
        {config.quadrant1}
      </Item>
      <Item
        group="b"
        key="b"
        style={{
          position: 'absolute',
          top: 0,
          left: width / 2,
          height: height / 2,
          width: width / 2
        }}
      >
        {config.quadrant2}
      </Item>
      <Item
        group="c"
        key="c"
        style={{
          position: 'absolute',
          top: height / 2,
          left: 0,
          height: height / 2,
          width: width / 2
        }}
      >
        {config.quadrant3}
      </Item>
      <Item
        group="d"
        key="d"
        style={{
          position: 'absolute',
          top: height / 2,
          left: width / 2,
          height: height / 2,
          width: width / 2
        }}
      >
        {config.quadrant4}
      </Item>
    </div>
  );
};

const colors = {
  a: '#e7ffac',
  b: '#fbe4ff',
  c: '#dcd3ff',
  d: '#ffccf9'
};

const Item = styled.div`background: ${props => colors[props.group]};`;

export default Quadrants;
