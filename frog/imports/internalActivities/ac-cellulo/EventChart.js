import React from 'react';
//we suppose that class time is 60 Minutes
export const EventChart = events => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '500px',
        left: '600px'
      }}
    >
      <svg width="400" height="110">
        <rect width="300" height="20" fill="white" stroke="black" />
      </svg>

      {events['events'].map((x, i) => (
        <div>
          {x[1] === 'run' ? (
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
          {x[1] === 'pause' ? (
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
