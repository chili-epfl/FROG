import React from 'react';
//import { Line } from 'rc-progress';
//we suppose that class time is 60 Minutes
export const EventChart = events => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '500px',
        left: '500px'
      }}
    >
      {events['events'].map((x, i) => (
        <div>
          {x[1] === 'run' ? (
            <img
              src="/clientFiles/ac-cellulo/icon.svg"
              height="20"
              width="20"
              style={{
                position: 'absolute',
                top: '40px',
                left: x[0].toString() + 'px'
              }}
            />
          ) : (
            <h3></h3>
          )}
          {x[1] === 'pause' ? (
            <img
              src="/clientFiles/ac-cellulo/Graph-Trial-1.svg"
              height="20"
              width="20"
              style={{
                position: 'absolute',
                top: '20px',
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
