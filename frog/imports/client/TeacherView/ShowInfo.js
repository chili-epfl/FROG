// @flow
import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Inspector, A } from 'frog-utils';
import Modal from 'react-modal';
import { Meteor } from 'meteor/meteor';
import copy from 'copy-to-clipboard';
import Stringify from 'json-stringify-pretty-compact';

import { connect } from '../GraphEditor/store';
import { Activities } from '/imports/api/activities';
import { Operators } from '/imports/api/operators';
import { downloadExport } from './utils/exportComponent';

const CopyButton = ({ data }) => (
  <A onClick={() => copy(Stringify(data))}>
    <i className="fa fa-clipboard" data-tip="Copy to clipboard" />
  </A>
);

const Data = ({ title, data }) =>
  data ? (
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>
        {title} <CopyButton data={data} />
      </h3>
      <Inspector data={data} />
    </div>
  ) : null;

class InfoComponent extends React.Component<
  any,
  { product: ?Object, object: ?Object }
> {
  state = { product: undefined, object: undefined };

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
      this.setState({ product: undefined, object: undefined });
      Meteor.call('get.object.product', id, (error, result) => {
        if (Array.isArray(result)) {
          this.setState({ object: result[0], product: result[1] });
        }
        this.inFlight = false;
      });
    }
  }

  render() {
    const { showInfo, cancelInfo, item } = this.props;
    const product = this.state?.product;
    const object = this.state?.object;
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
              <A
                onClick={() =>
                  downloadExport(item, object || {}, product || {})
                }
              >
                Export data
              </A>
            </li>
          )}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Data title="Config" data={item.data} />
          <Data title="Object" data={object} />
          <Data title="Product" data={product} />
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
    showInfo,
    cancelInfo
  };
})(InfoComponent);
ShowInfoConnect.displayName = 'ShowInfoConnect';

const ShowInfo = connect(({ store: { ui: { showInfo, cancelInfo } } }) => (
  <ShowInfoConnect showInfo={showInfo} cancelInfo={cancelInfo} />
));

export default ShowInfo;
