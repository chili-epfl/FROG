import React from 'react';

export const HeatMap = ({ Data }: { Data: number[] }) => {
  return (
    <div>
      <img
        src="/clientFiles/ac-cellulo/Graph-Trial-1.svg"
        alt="Logo"
        height="420"
        width="420"
      />
      <h1>dsdsds{Data[1]}</h1>
    </div>
  );
};
