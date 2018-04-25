// flow

import React from 'react';
import { Inspector, A } from 'frog-utils';
import { activityTypesObj } from '/imports/activityTypes';
import copy from 'copy-to-clipboard';
import Stringify from 'json-stringify-pretty-compact';

const CopyButton = ({ data }) => (
  <A onClick={() => copy(Stringify(data))}>
    <i className="fa fa-clipboard" data-tip="Copy to clipboard" />
  </A>
);

const Data = ({ title, data }) => (
  <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
    <h3>
      {title} <CopyButton data={data} />
    </h3>
    <Inspector data={data} />
  </div>
);

const ShowInfo = ({ activityData, data, activityType, userInfo }) => {
  const formatter = activityTypesObj[activityType].formatProduct;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <Data title="Config" data={activityData.config} />
      <Data title="activityData" data={activityData.data} />
      <Data title="currently reactive data" data={data} />
      {formatter && (
        <Data
          title="formatProduct"
          data={formatter(activityData.config, data, userInfo.id)}
        />
      )}
    </div>
  );
};

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
