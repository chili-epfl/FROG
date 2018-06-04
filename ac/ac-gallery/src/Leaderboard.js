/* eslint-disable react/no-array-index-key */

import { values } from 'frog-utils';
import * as React from 'react';

const Viewer = ({ state, LearningItem }) => (
  <div
    className="bootstrap"
    style={{ margin: '20px', backgroundColor: 'white' }}
  >
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Rank</th>
          <th />
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {values(state)
          .sort((x, y) => y.score - x.score)
          .map((li, index) => (
            <tr key={li.li.id || li.li}>
              <td className="col-md-4">{index + 1}</td>
              <td className="col-md-4">
                <div style={{ overflow: 'hidden', height: '150px' }}>
                  <LearningItem clickZoomable type="thumbView" id={li.li} />
                </div>
              </td>
              <td className="col-md-4">{Math.abs(li.score)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

const reactiveToDisplay = (reactive: any) => {
  const objects = {};
  values(reactive).forEach(instance => {
    values(instance).forEach(instobj => {
      const id = instobj.li.id || instobj.li;
      if (!objects[id]) {
        objects[id] = { score: 0, li: instobj.li };
      }
      objects[id].score += values(instobj.votes).reduce(
        (sum, x) => (x ? sum + 1 : sum),
        0
      );
    });
  });
  return objects;
};

export default {
  Viewer,
  reactiveToDisplay,
  initData: {}
};
