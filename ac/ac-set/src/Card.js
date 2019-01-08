import * as React from 'react';
import { decode } from './api';

const Diamond = ({ fill, stroke }) => (
  <polygon
    points="50,20 90,50 50,80 10,50"
    stroke={stroke}
    strokeWidth="4"
    fill={fill}
  />
);

const Oval = ({ fill, stroke }) => (
  <rect
    x="10"
    y="20"
    width="80"
    height="60"
    rx="25"
    stroke={stroke}
    strokeWidth="4"
    fill={fill}
  />
);

const Worm = ({ fill, stroke }) => (
  <path
    stroke={stroke}
    strokeWidth="4"
    fill={fill}
    d="m 10,50 c 3,-16 5,-22 13,-28 8,-4 15,-2 24,6 11,6 18,0 21,-2 3,-4 8,-8 15,-10 6,0 9,20 6,32 -2,10 -7,22 -13,28 -6,10 -16,2 -29,-6 -8,-4 -14,-2 -21,2 -4,4 -9,10 -14,10 -7,-2 -6,-12 -2,-32 z"
  />
);

const Pattern = ({ value, stroke }) => (
  <pattern
    id={'hatch' + value}
    width="5"
    height="10"
    patternUnits="userSpaceOnUse"
  >
    <line stroke={stroke} x1="0" y1="0" x2="0" y2="10" strokeWidth="3" />
  </pattern>
);

export default ({ value, selected, correct, wrong, onClick, style }) => {
  const [a, b, c, d] = decode(value);
  const color = ['#bb3333', '#33bb33', '#3333bb'][a];
  const filling = [color, 'url(#hatch' + value + ')', '#ffffff00'][b];
  const number = c + 1;
  const Shape = [Oval, Diamond, Worm][d];
  return (
    <div
      style={{
        border: selected ? 'solid red 3px' : 'solid black 3px',
        borderRadius: '6%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: selected
          ? '#fafafa'
          : wrong
          ? '#ff666644'
          : correct
          ? '#66ff6644'
          : '#fafafa',
        ...style
      }}
      onClick={onClick}
    >
      {((!correct && !wrong) || selected) &&
        new Array(number).fill().map((_, idx) => (
          <svg
            key={idx.toString()}
            viewBox="0 0 100 100"
            width="100%"
            height="33%"
            preserveAspectRatio="none"
          >
            <Shape fill={filling} stroke={color} />
            <Pattern value={value} stroke={color} />
          </svg>
        ))}
    </div>
  );
};
