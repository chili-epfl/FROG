// @flow
import React from 'react';
import { Inspector } from 'react-inspector';
import { createContainer } from 'meteor/react-meteor-data';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

import { connect } from '../GraphEditor/store';
import { Objects } from '../../api/objects';
import { Activities, Operators } from '../../api/activities';
import { Products } from '../../api/products';

const InfoComponent = ({ showInfo, cancelInfo, item, object, product }) => {
  if (!showInfo) {
    return null;
  }
  const actions = [<FlatButton label="X" secondary onClick={cancelInfo} />];
  return (
    <MuiThemeProvider>
      <Dialog
        title={item.title}
        modal={false}
        open
        actions={actions}
        onRequestClose={cancelInfo}
        contentStyle={{ overflow: 'auto', overflowY: 'auto' }}
      >
        <ul>
          <li>type: {item.activityType || item.operatorType}</li>
          <li>id: {item._id}</li>
          <li>State: {item.state}</li>
        </ul>
        <div style={{ display: 'flex' }}>
          <div>
            <h3>Object</h3>
            {object ? <Inspector data={object} expandLevel={5} /> : null}
          </div>
          <div style={{ marginLeft: '50px' }}>
            <h3>Product</h3>
            {product ? <Inspector data={product} expandLevel={5} /> : null}
          </div>
        </div>
      </Dialog>
    </MuiThemeProvider>
  );
};

const ShowInfoConnect = createContainer(({ showInfo, cancelInfo }) => {
  if (!showInfo) {
    return { showInfo: null };
  }
  const item = showInfo.klass === 'activity'
    ? Activities.findOne(showInfo.id)
    : Operators.findOne(showInfo.id);
  return {
    item,
    object: Objects.findOne(showInfo.id),
    product: Products.findOne(showInfo.id),
    showInfo,
    cancelInfo
  };
}, InfoComponent);
ShowInfoConnect.displayName = 'ShowInfoConnect';

export default connect(({ store: { ui: { showInfo, cancelInfo } } }) =>
  <ShowInfoConnect showInfo={showInfo} cancelInfo={cancelInfo} />
);
