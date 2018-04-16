import React from 'react';
import Inspector from 'react-inspector';
import { activityTypesObj } from '/imports/activityTypes';

const formatProduct = (data, activityType, config) => {
  const formatter = activityTypesObj[activityType].formatProduct;
  if (formatter) {
    return formatter(config, data);
  } else {
    return data;
  }
};

const ShowInfo = ({ activityData, data, activityType }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <div style={{ flexBasis: 0, flexGrow: 1 }}>
      <h3>Config</h3>
      <Inspector data={activityData.config} expandLevel={8} />
    </div>
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>activityData</h3>
      <Inspector data={activityData.data} expandLevel={8} />
    </div>
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>Current reactive data</h3>
      <Inspector
        data={formatProduct(data, activityType, activityData.config)}
        expandLevel={8}
      />
    </div>
  </div>
);

export default ShowInfo;

export const ShowInfoDash = ({ state, prepareDataForDisplay }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <div style={{ flexBasis: 0, flexGrow: 1 }}>
      <h3>State</h3>
      <Inspector data={state} expandLevel={8} />
    </div>
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>prepareDataForDisplay</h3>
      <Inspector data={prepareDataForDisplay} expandLevel={8} />
    </div>
  </div>
);
