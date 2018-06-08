// @flow
import {
  uuid,
  wrapUnitAll,
  type productOperatorT,
  type activityDataT
} from 'frog-utils';
import liType from './liType';
import { isEmpty } from 'lodash';
import pkg from './index';

export const operator = (configData: {
  urls?: string[],
  limit?: number
}): activityDataT => {
  console.log(configData);
  if (!isEmpty(configData.urls)) {
    return import('davefeedread').then(feedread =>
      Promise.all(
        configData.urls.map(
          url =>
            new Promise((resolve, reject) => {
              feedread.parseUrl(url, 60, (err, feed) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(
                    feed.items.reduce((acc, x) => {
                      const id = uuid();
                      return {
                        ...acc,
                        [id]: {
                          id,
                          liDocument: {
                            liType: 'li-rss',
                            createdAt: new Date(),
                            createdBy: 'op-rss',
                            payload: {
                              content: x.description,
                              title: x.title
                            }
                          }
                        }
                      };
                    }, {})
                  );
                }
              });
            })
        )
      ).then(res => wrapUnitAll(res.reduce((acc, x) => ({ ...acc, ...x }), {})))
    );
  } else {
    return wrapUnitAll({});
  }
};

export default ({
  ...pkg,
  operator
}: productOperatorT);
