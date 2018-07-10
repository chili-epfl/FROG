// @flow

import React from 'react';

const partsNames = [
  'Presentation',
  'Examples',
  'TestFeedback',
  'Definition',
  'Test'
];

export const ItemComponent = ({ x, i, data, nbInst, lineNb }: Object) => (
  <div style={{ flexDirectioon: 'column' }}>
    <div>{partsNames[i]}</div>
    <div className="progress" style={{ width: x > 0 ? '150px' : '0px' }}>
      <div
        className="progress-bar progress-bar-striped"
        role="progressbar"
        aria-valuenow={Math.round(
          100 * data[partsNames[i]][lineNb] / (nbInst * x ** (1 - lineNb))
        )}
        aria-valuemin="0"
        aria-valuemax="100"
        style={{
          width:
            Math.round(
              100 * data[partsNames[i]][lineNb] / (nbInst * x ** (1 - lineNb))
            ).toString() + '%'
        }}
      >
        {Math.round(
          100 * data[partsNames[i]][lineNb] / (nbInst * x ** (1 - lineNb))
        ).toString() + '%'}
      </div>
    </div>
  </div>
);

export const ListComponent = (props: Object) => (
  <div>
    <div>{props.title}</div>
    <div style={{ display: 'flex', flexDirectioon: 'row', margin: '10px' }}>
      {props.parts.map(
        (x, i) =>
          x > 0 ? (
            <ItemComponent
              key={x.toString() + i.toString()}
              {...{ x, i }}
              data={props.data}
              nbInst={props.nbInst}
              lineNb={props.lineNb}
            />
          ) : (
            <div key={x.toString() + i.toString()} />
          )
      )}
    </div>
  </div>
);
