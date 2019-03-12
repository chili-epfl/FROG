// @flow

import * as React from 'react';

import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';

const doc = connection.get('li', 1);
const dataFn = generateReactiveFn(doc, LI);
const LearningItem = dataFn.LearningItem;

export default ({
  match: {
    params: { wikiId, pageId }
  }
}: {
  match: { params: { wikiId?: string, pageId?: string } }
}) => {
  return (
    <h1>
      Welcome to wiki {wikiId},{' '}
      {pageId ? (
        <div>
          you chose page {pageId}
          <LearningItem type="edit" id={pageId} />
          <a
            onClick={() => {
              dataFn.createLearningItem(
                'li-richText',
                undefined,
                undefined,
                undefined,
                undefined,
                pageId
              );
            }}
          >
            Create learning item
          </a>
        </div>
      ) : (
        `you didn't choose a page`
      )}
    </h1>
  );
};
