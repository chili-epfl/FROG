import * as React from 'react';
import AppH from './components/app';

const Viewer = ({ sendMsg, state, activity }) => {
  const doWhatIWantWithXY = (x, y) => {
    sendMsg(
      JSON.stringify({
        positionx: (x / 96) * 25.4 * 5,
        positiony: (y / 96) * 25.4 * 5
      })
    );
  };

  return (
    <div>
      <div
        style={{
          position: 'relative'
        }}
      >
        <h1
          style={{
            position: 'absolute',
            top: '100px',
            left: '400px'
          }}
        >
          Aggregated Picture of Classroom
        </h1>

        {state.heatmapData.map((x, i) => (
          <div
            style={{
              position: 'absolute',
              top: 300 + Math.round(i / 3) * 500 + 'px',
              left: 400 + (i % 2) * 600 + 'px'
            }}
          >
            <AppH
              func={doWhatIWantWithXY}
              data={x}
              TeamNumber={state.TeamNumber + 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
const widthGridTable = 10;
const heightGridTable = 10;
const prepareDataForDisplay = state => state;
const mergeLog = (state, log) => {
  //log.Payload.positionx
  if (state.events.length > 43) {
    state.events.push([
      ((log.timestamp.getTime() - state.events[43][0]) * 300) / 600000,
      'run'
    ]);
  } else {
    state.events.push([log.timestamp.getTime(), 'run']);
  }
  //console.log(log.timestamp.getTime() - state.events[15][0]);
  if ('Payload' in log) {
    state.heatmapData[log.ID.TeamNumber].push([
      Number(((log.Payload.positionx * 96) / 25.4 / 5).toFixed(0)),
      Number(((log.Payload.positiony * 96) / 25.4 / 5).toFixed(0)),
      1
    ]);
    state.TeamNumber = log.ID.TeamNumber;
  }
  console.log(state.heatmapData);
};

export default {
  initData: {
    TeamNumber: 0,
    heatmapData: new Array(4)
      .fill(0)
      .map(() => new Array(1).fill(0).map(() => new Array(3).fill(0))),
    gridTable: new Array(heightGridTable)
      .fill(0)
      .map(() => new Array(widthGridTable).fill(0)),
    events: new Array(1).fill(0).map(() => new Array(2).fill(0))
  },
  mergeLog,
  prepareDataForDisplay,
  Viewer
};
