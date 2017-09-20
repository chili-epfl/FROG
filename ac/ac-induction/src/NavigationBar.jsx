// @flow

import React from 'react';
import styled from 'styled-components';

const LiBis = styled.li`text-align: center;`;

export default (props: Object) => {
  console.log('navBar');
  return (
    <ul className="nav nav-tabs">
      {props.parts.map((x, i) =>
        <LiBis
          key={x + i.toString()}
          className={props.active === i ? 'active' : ''}
          style={{ width: 100 / props.parts.length + '%' }}
        >
          <a
            style={{
              backgroundColor: props.active === i ? '#A0A0F0' : '',
              color: 'black'
            }}
          >
            {'Part ' + i + ': ' + x}
          </a>
        </LiBis>
      )}
    </ul>
  );
};
