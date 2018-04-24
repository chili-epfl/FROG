// flow

import React from 'react';
import { Inspector } from 'frog-utils';
import { activityTypesObj } from '/imports/activityTypes';

const formatProduct = (data, activityType, config, userInfo) => {
  const formatter = activityTypesObj[activityType].formatProduct;
  if (formatter) {
    return formatter(config, data, userInfo);
  } else {
    return data;
  }
};

const ShowInfo = ({ activityData, data, activityType, userInfo }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <div style={{ flexBasis: 0, flexGrow: 1 }}>
      <h3>Config</h3>
      <Inspector data={activityData.config} />
    </div>
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>activityData</h3>
      <Inspector data={activityData.data} />
    </div>
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>Current reactive data</h3>
      <Inspector
        data={formatProduct(
          data,
          activityType,
          activityData.config,
          userInfo.id
        )}
      />
    </div>
  </div>
);

export default ShowInfo;

export const ShowInfoDash = ({ state, prepareDataForDisplay }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <div style={{ flexBasis: 0, flexGrow: 1 }}>
      <h3>State</h3>
      <Inspector data={state} />
    </div>
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>prepareDataForDisplay</h3>
      <Inspector data={prepareDataForDisplay} />
    </div>
  </div>
);
