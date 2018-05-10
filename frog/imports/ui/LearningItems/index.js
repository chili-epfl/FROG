// @flow
import * as React from 'react';
import { uuid } from 'frog-utils';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import { withState } from 'recompose';
import 'rc-slider/assets/index.css';
import { omit } from 'lodash';
import Spinner from 'react-spinner';
import { Meteor } from 'meteor/meteor';

import ReactiveHOC from './ReactiveHOC';
import { connection } from '../App/connection';
import { uploadFile } from '../../api/openUploads';
import LearningItemChooser from './LearningItemChooser';
import { learningItemTypesObj } from './learningItemTypes';

const LearningItem = ({
  id,
  render,
  type,
  li,
  onCreate,
  meta,
  clickZoomable,
  dataFn
}: {
  id?: string,
  render?: Function,
  type?: string,
  li?: string,
  onCreate?: Function,
  meta?: Object,
  clickZoomable?: boolean,
  dataFn?: Object
}) => {
  if (type === 'history') {
    return <LearningItemWithSlider id={id} render={render} />;
  }
  if (type === 'create') {
    if (!dataFn) {
      throw new Error('Cannot create without dataFn');
    }
    if (li) {
      const liT = learningItemTypesObj[li];
      if (liT.create) {
        const ToRun = liT.create;
        return (
          <ToRun
            uploadFn={uploadFile}
            createLearningItem={(liType, item) =>
              dataFn.createLearningItem(liType, item, {
                ...meta,
                ...dataFn.meta
              })
            }
            onCreate={onCreate}
            LearningItem={LearningItem}
          />
        );
      } else {
        const lid = dataFn.createLearningItem(liT.id, liT.dataStructure, {
          ...meta,
          draft: true
        });
        return (
          <LearningItem
            id={lid}
            type="edit"
            meta={meta}
            render={({ dataFn: childDataFn, children }) => (
              <div style={{ marginLeft: '10px' }}>
                {children}
                <Button
                  color="primary"
                  onClick={() => {
                    childDataFn.objInsert(false, 'draft');
                    childDataFn.objInsert(new Date(), 'createdAt');
                    if (onCreate) {
                      onCreate(lid);
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            )}
          />
        );
      }
    } else {
      return (
        <LearningItemChooser dataFn={dataFn} onCreate={onCreate} meta={meta} />
      );
    }
  } else {
    const ToRun = ReactiveHOC(
      id || uuid(),
      undefined,
      undefined,
      undefined,
      'li'
    )(RenderLearningItem);
    return (
      <ToRun
        render={render}
        type={type}
        li={li}
        clickZoomable={clickZoomable}
      />
    );
  }
};

export default LearningItem;
