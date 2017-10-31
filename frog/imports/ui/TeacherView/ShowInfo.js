// @flow
import React from 'react';
import { Inspector } from 'react-inspector';
import { createContainer } from 'meteor/react-meteor-data';
import { A } from 'frog-utils';
import Modal from 'react-modal';
import JSZip from 'jszip';
import Stringify from 'json-stringify-pretty-compact';
import FileSaver from 'file-saver';
import { Meteor } from 'meteor/meteor';

import { connect } from '../GraphEditor/store';
import { Objects } from '../../api/objects';
import { Activities, Operators } from '../../api/activities';
import { activityTypesObj } from '../../activityTypes';
import { Products } from '../../api/products';

const userIds = {};
const userLookup = (userId: string): [string, string] => {
  if (userId === 'instanceId') {
    return ['userid', 'username'];
  }
  const cache = userIds[userId];
  if (cache) {
    return cache;
  }
  const userobj = Meteor.users.findOne(userId);
  const ret = userobj ? [userobj.userid || '', userobj.username] : [userId, ''];
  userIds[userId] = ret;
  return ret;
};

const splitOnFirst = (val, char) => {
  const idx = val.indexOf(char);
  if (!idx) {
    return val;
  }
  return [val.substring(0, idx), val.substring(idx + 1)];
};

const downloadExport = (item, object, product) => {
  const aT = activityTypesObj[item.activityType];
  const zip = new JSZip();
  const img = zip.folder(item._id);
  img.file('product.json', Stringify(product));
  img.file('object.json', Stringify(object));
  img.file('config.json', Stringify(item.data));
  if (aT.exportData) {
    let data = aT.exportData(item.data, product.activityData, userLookup);
    if (item.plane === 1) {
      data = data
        .split('\n')
        .map(line => {
          const [id, rest] = splitOnFirst(line, '\t');
          return [...userLookup(id), rest].join('\t');
        })
        .join('\n');
      img.file('data.tsv', data);
    }
    zip
      .generateAsync({ type: 'blob' })
      .then(content =>
        FileSaver.saveAs(
          content,
          `${item._id.slice(-4)}-${item.activityType}.zip`,
          true
        )
      );
  }
};

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
          {item.data ? (
            <Inspector data={{ data: item.data }} expandLevel={5} />
          ) : null}
        </div>
        <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
          <h3>Object</h3>
          {object ? <Inspector data={{ object }} expandLevel={5} /> : null}
        </div>
        <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
          <h3>Product</h3>
          {product ? <Inspector data={{ product }} expandLevel={5} /> : null}
        </div>
      </div>
    </Modal>
  );
};

const ShowInfoConnect = createContainer(({ showInfo, cancelInfo }) => {
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
}, InfoComponent);
ShowInfoConnect.displayName = 'ShowInfoConnect';

const ShowInfo = connect(({ store: { ui: { showInfo, cancelInfo } } }) => (
  <ShowInfoConnect showInfo={showInfo} cancelInfo={cancelInfo} />
));

export default ShowInfo;
