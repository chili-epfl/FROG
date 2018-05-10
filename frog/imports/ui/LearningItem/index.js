// @flow
import * as React from 'react';
import { type LearningItemFnT } from 'frog-utils';
import Button from 'material-ui/Button';

import ReactiveHOC from '../StudentView/ReactiveHOC';
import LearningItemChooser from './LearningItemChooser';
import { learningItemTypesObj } from './learningItemTypes';
import LearningItemWithSlider from './LearningItemWithSlider';
import RenderLearningItem from './RenderLearningItem';

const LearningItem = (props: LearningItemFnT) => {
  if (props.type === 'history') {
    return <LearningItemWithSlider id={props.id} render={props.render} />;
  }
  if (
    props.type === 'view' ||
    props.type === 'viewThumb' ||
    props.type === 'edit'
  ) {
    const ToRun = ReactiveHOC(
      props.id,
      props.dataFn.doc.connection,
      undefined,
      'li'
    )(RenderLearningItem);
    return (
      <ToRun
        render={props.render}
        type={props.type}
        id={props.id}
        clickZoomable={props.type === 'viewThumb' && props.clickZoomable}
      />
    );
  }
  if (props.type === 'create') {
    if (props.liType) {
      const liT = learningItemTypesObj[props.liType];
      if (liT.create) {
        const ToRun = liT.create;
        const dataFn = props.dataFn;
        return (
          <ToRun
            createLearningItem={(liType, item) =>
              dataFn.createLearningItem(liType, item, {
                ...(props.meta || {}),
                ...dataFn.meta
              })
            }
            onCreate={props.onCreate}
            LearningItem={LearningItem}
          />
        );
      } else {
        const lid = props.dataFn.createLearningItem(liT.id, liT.dataStructure, {
          ...props.meta,
          draft: true
        });
        const onCreate = props.onCreate;
        return (
          <LearningItem
            id={lid}
            type="edit"
            dataFn={props.dataFn}
            meta={props.meta}
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
        <LearningItemChooser
          dataFn={props.dataFn}
          onCreate={props.onCreate}
          meta={props.meta}
        />
      );
    }
  }
  return null;
};

export default LearningItem;
