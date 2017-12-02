import React from 'react';

export const Plus = ({ scaleX, scaleY, openFn }) =>
  <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
    <svg
      onClick={openFn}
      x="0px"
      y="0px"
      viewBox="0 0 50 50"
      style={{
        enableBackground: 'new 0 0 50 50',
        width: 50 / scaleX + 'px',
        height: 50 / scaleY + 'px'
      }}
    >
      <circle style={{ fill: '#43B05C' }} cx="25" cy="25" r="25" />
      <line
        style={{
          fill: 'none',
          stroke: '#FFFFFF',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: 10
        }}
        x1="25"
        y1="13"
        x2="25"
        y2="38"
      />
      <line
        style={{
          fill: 'none',
          stroke: '#FFFFFF',
          strokeWidth: 2,
          strokeLinecap: 'round',
          skrokeLinejoin: 'round',
          strokeMiterlimit: 10
        }}
        x1="37.5"
        y1="25"
        x2="12.5"
        y2="25"
      />
    </svg>
  </div>;
