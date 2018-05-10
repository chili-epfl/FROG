// @flow
import * as React from 'react';
import { type LearningItemFnT, uuid } from 'frog-utils';
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
    props.type === 'thumbView' ||
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
        clickZoomable={props.type === 'thumbView' && props.clickZoomable}
      />
    );
  }
  if (props.type === 'create') {
    let onCreate;
    if (props.autoInsert) {
      onCreate = li => {
        const id = uuid();
        props.dataFn.objInsert({ li, id, ...(props.meta || {}) }, id);
        if (typeof props.onCreate === 'function') {
          props.onCreate(li);
        }
      };
    }
    if (!onCreate) {
      onCreate = props.onCreate || (_ => {});
    }
    if (props.liType) {
      const liT = learningItemTypesObj[props.liType];
      if (liT.Creator) {
        const ToRun = liT.Creator;
        const dataFn = props.dataFn;
        return (
          <ToRun
            createLearningItem={(liType, item) =>
              dataFn.createLearningItem(liType, item, dataFn.meta)
            }
            onCreate={onCreate}
            LearningItem={LearningItem}
          />
        );
      } else {
        const lid = props.dataFn.createLearningItem(liT.id, liT.dataStructure, {
          draft: true
        });
        const onCreateFlow = onCreate;
        return (
          <LearningItem
            id={lid}
            type="edit"
            dataFn={props.dataFn}
            render={({ dataFn: childDataFn, children }) => (
              <div style={{ marginLeft: '10px' }}>
                {children}
                <Button
                  variant="raised"
                  color="primary"
                  onClick={() => {
                    childDataFn.objInsert(false, 'draft');
                    childDataFn.objInsert(new Date(), 'createdAt');
                    onCreateFlow(lid);
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
      return <LearningItemChooser dataFn={props.dataFn} onCreate={onCreate} />;
    }
  }
  return null;
};

export default LearningItem;
