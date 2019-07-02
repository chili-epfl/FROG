// @flow

import { Meteor } from 'meteor/meteor';

import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import { activityTypesObj } from '/imports/activityTypes';
import { Sessions, Activities, Objects } from '/imports/collections';
import {
  createNewEmptyWikiDoc,
  addNewWikiPage
} from '/imports/api/wikiDocHelpers';

import { serverConnection as connection } from './share-db-manager';

const exportActivity = (activityId, wiki, page, userId) => {
  const act = Activities.findOne(activityId);

  const obj = Objects.findOne(act._id);
  importWikiFromFROG(act, obj, wiki, page || act.title, userId);
};

const exportSessionWiki = (sessionId, wiki, userId) => {
  const session = Sessions.findOne(sessionId);

  const activities = Activities.find({
    graphId: session.graphId
  }).fetch();

  activities.forEach(act => {
    const obj = Objects.findOne(act._id);
    if (obj) {
      importWikiFromFROG(act, obj, wiki, act.title, userId);
    }
  });
};

export const importWikiFromFROG = async (item, object, wiki, page, userId) => {
  const instances = await new Promise(resolve =>
    connection.createFetchQuery(
      'rz',
      { _id: { $regex: '^' + item._id } },
      null,
      (err, results) => {
        if (err) {
          console.error(err);
        }
        resolve(results.map(x => x.id.replace(item._id + '/', '')));
      }
    )
  );
  const genericDoc = connection.get('li');
  const dataFn = generateReactiveFn(genericDoc);
  const instanceData = instances
    .filter(x => x !== userId)
    .reduce((acc, x) => {
      const payload = {
        acType: item.activityType,
        activityData: { config: item.data },
        rz: item._id + '/' + x,
        title: item.title,
        activityTypeTitle: activityTypesObj[item.activityType].meta.name
      };

      const newId = dataFn.createLearningItem(
        'li-activity',
        payload,
        {
          title: page
        },
        true
      );

      acc[x] = {
        liId: newId,
        instanceName: item.groupingKey
          ? item.groupingKey + ' ' + x
          : Meteor.users.findOne(x)?.username,
        instanceId: x
      };
      return acc;
    }, {});
  const wikiDoc = connection.get('wiki', wiki);
  wikiDoc.subscribe(() => {
    if (!wikiDoc.type) {
      const liId = dataFn.createLearningItem('li-richText', undefined, {
        wikiId: wiki
      });
      createNewEmptyWikiDoc(wikiDoc, wiki, liId);
    }
    addNewWikiPage(
      wikiDoc,
      page,
      true,
      'li-activity',
      instanceData.all?.liId || instanceData[userId]?.liId || null,
      item.plane,
      item.plane === 3
        ? undefined
        : Object.keys(instanceData)
            .filter(key => key !== userId)
            .reduce((obj, key) => {
              obj[key] = instanceData[key];
              return obj;
            }, {}),
      item.groupingKey ? object.socialStructure[item.groupingKey] : undefined,
      true
    );
  });
};

Meteor.methods({
  'export.session.wiki': exportSessionWiki,
  'export.activity.wiki': exportActivity
});
