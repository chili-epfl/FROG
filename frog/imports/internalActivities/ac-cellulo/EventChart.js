import React from 'react';
//we suppose that class time is 60 Minutes
export const EventChart = events => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '100px',
        left: '600px'
      }}
    >
      <h1
        style={{
          position: 'absolute',
          top: '-60px',
          left: '0px'
        }}
      >
        Event Bars
      </h1>
      <svg width="800" height="110">
        <rect width="600" height="20" fill="white" stroke="black" />
      </svg>
      <h2
        style={{
          position: 'absolute',
          top: '-10px',
          left: '-100px'
        }}
      >
        Group 1
      </h2>
      {events['events'].map((x, i) => (
        <div>
          {x[1] === 'vpl:run' ? (
            <img
              src="/clientFiles/ac-cellulo/icon.svg"
              height="20"
              width="20"
              style={{
                position: 'absolute',
                top: '0px',
                left: x[0].toString() + 'px'
              }}
            />
          ) : (
            <h3></h3>
          )}
          {x[1] === 'vpl:stop' ? (
            <img
              src="/clientFiles/ac-cellulo/pause.svg"
              height="20"
              width="20"
              style={{
                position: 'absolute',
                top: '0px',
                left: x[0].toString() + 'px'
              }}
            />
          ) : (
            <h3></h3>
          )}
        </div>
      ))}
    </div>
  );
};
