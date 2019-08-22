// @flow

import { Meteor } from 'meteor/meteor';
import JSZip from 'jszip';
import Stringify from 'json-stringify-pretty-compact';
import FileSaver from 'file-saver';
import {
  cleanEmptyCols,
  type ActivityDbT,
  strfTime
} from '/imports/frog-utils';
import { omit } from 'lodash';

import { UploadList, downloadFile } from '/imports/api/openUploads';
import { Sessions } from '/imports/api/sessions';
import { Activities } from '/imports/api/activities';
import { Operators } from '/imports/api/operators';
import { activityTypesObj } from '/imports/activityTypes';
import { getActivitySequence } from '/imports/api/graphSequence';
import { graphToString } from '/imports/api/exportGraph';
import downloadLog from './downloadLog';
import exportGraphPNG from '../../GraphEditor/utils/exportPicture';
import { getUsername } from '/imports/api/users';

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
  const ret = userobj
    ? [userobj.userid || '', getUsername({ meteorUser: userobj })]
    : [userId, ''];
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

export const generateExport = (
  item: ActivityDbT,
  object: Object,
  product: Object,
  img: Object
) => {
  const aT = activityTypesObj[item.activityType];
  img.file('product.json', Stringify(product));
  img.file('object.json', Stringify(object));
  img.file('config.json', Stringify(item.data));
  img.file('activity.json', Stringify(omit(item, 'data')));
  if (aT && aT.exportData && product && product.activityData) {
    let data = aT.exportData(item.data, product.activityData);
    data = cleanEmptyCols(data);
    if (item.plane === 1) {
      data = data
        .split('\n')
        .map(line => {
          const [id, rest] = splitOnFirst(line, '\t');
          return [id, ...userLookup(id), rest].join('\t');
        })
        .join('\n');
    }
    img.file('data.tsv', data);
  }
  if (item.plane === 2 && object && object.socialStructure) {
    const struct = object.socialStructure[item.groupingKey];
    const mappings = Object.keys(struct)
      .reduce(
        (acc, i) => [
          ...acc,
          ...struct[i].map(user => userLookup(user).join('\t') + '\t' + i)
        ],
        []
      )
      .join('\n');
    const userfile = 'userid\tusername\tinstanceid\n' + mappings;

    img.file('usermappings-' + (item.groupingKey || '???') + '.tsv', userfile);
  }
};

const slugo = input =>
  input
    .replace(/<(?:.|\n)*?>/gm, '')
    .replace(/[!\"#$%&'\(\)\*\+,\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '') // eslint-disable-line no-useless-escape
    .replace(/(\s|\.)/g, '-')
    .toLowerCase();

const productPromise = id =>
  new Promise(resolve =>
    Meteor.call('reactive.to.product', id, (_, result) => resolve(result))
  );

const objectProductPromise = id =>
  new Promise(resolve =>
    Meteor.call('get.object.product', id, (_, result) => resolve(result))
  );

export const exportSession = (sessionId: string) => {
  const session = Sessions.findOne(sessionId);
  const activities = Activities.find({ graphId: session.graphId }).fetch();
  const operators = Operators.find({ graphId: session.graphId }).fetch();
  const files = UploadList.find({ sessionId }).fetch();
  const zip = new JSZip();
  const activitySequence = getActivitySequence(activities);
  activities.forEach(async act => {
    const result = await objectProductPromise(act._id);
    const object = result[0];
    let product = result[1];
    if (!product) {
      product = await productPromise(act._id);
    }
    const img = zip.folder(
      `${activitySequence[act._id]}-${slugo(act.title || '').slice(0, 20)}__p${
        act.plane
      }__${act.activityType}-${act._id.slice(-4)}`
    );
    generateExport(act, object, product, img);
  });

  const opfolder = zip.folder('op');
  operators.forEach(async op => {
    const opfo = opfolder.folder(
      `${slugo((op.title || '').slice(0, 20))}__${
        op.operatorType
      }-${op._id.slice(-4)}`
    );
    const [object, product] = await objectProductPromise(op._id);

    opfo.file('product.json', Stringify(product));
    opfo.file('object.json', Stringify(object));
    opfo.file('config.json', Stringify(op.data));
  });

  // const fileFolder = zip.folder('files')
  files.forEach(() => {
    downloadFile(); // don't do anything yet
  });

  zip.file(slugo(session.name || '') + '.frog', graphToString(session.graphId));

  exportGraphPNG(url => {
    zip.file('graph.png', url.split('base64,')[1], { base64: true });
    downloadLog(sessionId, result => {
      zip.file('log.tsv', result);
      Meteor.call('session.find_start', sessionId, (err, succ) => {
        if (succ) {
          zip
            .generateAsync({ type: 'blob', compression: 'DEFLATE' })
            .then(content =>
              FileSaver.saveAs(
                content,
                `${session.slug}--${strfTime(
                  '%d-%m-%y__%H-%M',
                  succ
                )}--${sessionId}.zip`,
                true
              )
            );
        }
      });
    });
  });
};

export const downloadExport = (
  item: Object,
  object: Object,
  product: Object
) => {
  const img = new JSZip();
  generateExport(item, object, product, img);

  img
    .generateAsync({ type: 'blob', compression: 'DEFLATE' })
    .then(content =>
      FileSaver.saveAs(
        content,
        `${slugo(item.title || '').slice(0, 20)}__${
          item.activityType
        }-${item._id.slice(-4)}`,
        true
      )
    );
};
