// @flow

import { Meteor } from 'meteor/meteor';

export const createSession = (templateId: string, templateConfig: any) => {
  return new Promise<string>((resolve, reject) => {
    if (!templateConfig.invalid) {
      Meteor.call(
        'create.graph.from.activity',
        templateId,
        templateConfig,
        3,
        (err, result) => {
          if (err) {
            reject('Could not create your activity, please try again later.');
          } else {
            const slug = result.slug;
            resolve(slug);
          }
        }
      );
    } else {
      reject('Could not create session, the configuration has errors');
    }
  });
};
