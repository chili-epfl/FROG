// @flow
import * as React from 'react';
import {
  type LIComponentPropsT,
  type LearningItemT,
  uuid,
  Doc
} from 'frog-utils';
import Button from '@material-ui/core/Button';

import ReactiveHOC from '../StudentView/ReactiveHOC';
import LearningItemChooser from './LearningItemChooser';
import { learningItemTypesObj } from './learningItemTypes';
import LearningItemWithSlider from './LearningItemWithSlider';
import RenderLearningItem from './RenderLearningItem';

const LearningItem = (props: {
  ...{| dataFn: Doc |},
  ...LIComponentPropsT
}) => {
  if (props.type === 'history' && typeof props.id === 'string') {
    return (
      <LearningItemWithSlider
        id={props.id}
        render={props.render}
        dataFn={props.dataFn}
      />
    );
  }
  if (
    props.type === 'view' ||
    props.type === 'thumbView' ||
    props.type === 'edit'
  ) {
    const id = props.id;
    const ToRun =
      typeof id === 'string'
        ? ReactiveHOC(
            id,
            props.dataFn.doc.connection,
            undefined,
            'li',
            undefined,
            props.dataFn.backend
          )(RenderLearningItem)
        : newprops => <RenderLearningItem data={id.liDocument} {...newprops} />;

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
      onCreate = props.onCreate;
    }
    if (props.liType) {
      const liT: LearningItemT<any> = learningItemTypesObj[props.liType];
      if (liT.Creator) {
        const ToRun = liT.Creator;
        const dataFn = props.dataFn;
        return (
          <ToRun
            createLearningItem={(liType, item, _, immutable) => {
              const id = dataFn.createLearningItem(
                liType,
                item,
                dataFn.meta,
                immutable
              );
              if (id && onCreate) {
                onCreate(id);
              }
              return id;
            }}
            LearningItem={dataFn.LearningItem}
          />
        );
      } else {
        const lid = props.dataFn.createLearningItem(liT.id, liT.dataStructure, {
          draft: true
        });
        if (typeof lid === 'string') {
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
        } else {
          return <h4>Cannot edit static learning item</h4>;
        }
      }
    } else {
      return <LearningItemChooser dataFn={props.dataFn} onCreate={onCreate} />;
    }
  }
  return null;
};

export default LearningItem;
