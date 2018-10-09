// @flow
import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Inspector, A } from 'frog-utils';
import Modal from 'react-modal';
import { Meteor } from 'meteor/meteor';

import { connect } from '../GraphEditor/store';
import { Objects } from '../../api/objects';
import { Activities } from '../../api/activities';
import { Operators } from '../../api/operators';
import { downloadExport } from './utils/exportComponent';

class InfoComponent extends React.Component<any, { product: ?Object }> {
  state = { product: undefined };
  inFlight = false;

  constructor(props) {
    super(props);
    if (props.showInfo) {
      this.update(props.item._id);
    }
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.item?._id &&
      ((nextProps.showInfo && !this.state?.product) ||
        nextProps.item?._id !== this.props.item?._id)
    ) {
      this.update(nextProps.item._id);
    }
  }

  update(id) {
    if (!this.inFlight) {
      this.inFlight = true;
      this.setState({ product: undefined });
      Meteor.call('get.product', id, (error, product) => {
        this.setState({ product });
        this.inFlight = false;
      });
    }
  }

  render() {
    const { showInfo, cancelInfo, item, object } = this.props;
    const product = this.state?.product;
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
  }
}

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
    showInfo,
    cancelInfo
  };
})(InfoComponent);
ShowInfoConnect.displayName = 'ShowInfoConnect';

const ShowInfo = connect(({ store: { ui: { showInfo, cancelInfo } } }) => (
  <ShowInfoConnect showInfo={showInfo} cancelInfo={cancelInfo} />
));

export default ShowInfo;
