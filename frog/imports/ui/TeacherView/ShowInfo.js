// @flow
import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Inspector, A } from 'frog-utils';
import Modal from 'react-modal';

import { connect } from '../GraphEditor/store';
import { Objects } from '../../api/objects';
import { Activities, Operators } from '../../api/activities';
import { Products } from '../../api/products';
import { downloadExport } from './utils/exportComponent';

const InfoComponent = ({ showInfo, cancelInfo, item, object, product }) => {
  if (!showInfo) {
    return null;
  }
  return (
    <Modal
      contentLabel="showInfo"
      title={item.title}
      isOpen
      onRequestClose={cancelInfo}
    >
      <ul>
        <li>type: {item.activityType || item.operatorType}</li>
        <li>id: {item._id}</li>
        <li>State: {item.state}</li>
        {product && (
          <li>
            <A onClick={() => downloadExport(item, object, product)}>
              Export data
            </A>
          </li>
        )}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ flexBasis: 0, flexGrow: 1 }}>
          <h3>Config</h3>
          {item.data ? <Inspector data={{ data: item.data }} /> : null}
        </div>
        <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
          <h3>Object</h3>
          {object ? <Inspector data={{ object }} /> : null}
        </div>
        <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
          <h3>Product</h3>
          {product ? <Inspector data={{ product }} /> : null}
        </div>
      </div>
    </Modal>
  );
};

const ShowInfoConnect = withTracker(({ showInfo, cancelInfo }) => {
  if (!showInfo) {
    return { showInfo: null };
  }
  const item =
    showInfo.klass === 'activity'
      ? Activities.findOne(showInfo.id)
      : Operators.findOne(showInfo.id);
  return {
    item,
    object: Objects.findOne(showInfo.id),
    product: Products.findOne(showInfo.id),
    showInfo,
    cancelInfo
  };
})(InfoComponent);
ShowInfoConnect.displayName = 'ShowInfoConnect';

const ShowInfo = connect(({ store: { ui: { showInfo, cancelInfo } } }) => (
  <ShowInfoConnect showInfo={showInfo} cancelInfo={cancelInfo} />
));

export default ShowInfo;
