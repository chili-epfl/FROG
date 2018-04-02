// @flow
import * as React from 'react';
import { omit } from 'lodash';
import { uuid } from 'frog-utils';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import { withState } from 'recompose';

import ReactiveHOC from './ReactiveHOC';
import { connection } from '../App/connection';
import { uploadFile } from '../../api/openUploads';
import LearningItemChooser from './LearningItemChooser';
import { learningItemTypesObj } from './learningItemTypes';

const createLearningItem = (liType, item, meta) => {
  const id = uuid();
  if (!connection) {
    throw new Error();
  }
  const itempointer = connection.get('li', id);
  itempointer.create({ liType, payload: item, ...meta });
  itempointer.subscribe();
  return id;
};

const RenderLearningItem = withState('open', 'setOpen', undefined)(
  ({ open, setOpen, data, dataFn, render, type = 'view', clickZoomable }) => {
    const liType = learningItemTypesObj[data.liType];
    if (!liType) {
      return <h1>Upz</h1>;
    }
    let Component = liType[type];
    if (!Component) {
      if (type === 'view' && liType.viewThumb) {
        Component = liType.viewThumb;
      } else {
        return (
          <b>Unsupported learning item type {JSON.stringify(data.liType)}</b>
        );
      }
    }
    const Comp = (
      <React.Fragment>
        <span onClick={() => setOpen(true)}>
          <Component
            LearningItem={LearningItem}
            data={data.payload}
            dataFn={dataFn && dataFn.specialize('payload')}
          />
        </span>
        {(() => {
          if (open && type === 'viewThumb' && clickZoomable && liType['view']) {
            const View = liType['view'];

            return (
              <Dialog open onClose={() => setOpen(false)}>
                <View
                  data={data.payload}
                  dataFn={dataFn && dataFn.specialize('payload')}
                />
              </Dialog>
            );
          }
          return null;
        })()}
      </React.Fragment>
    );
    if (render) {
      return render({
        meta: { id: dataFn.doc.id, ...omit(data, 'payload') },
        dataFn,
        children: Comp,
        editable: liType.editable,
        zoomable: liType.zoomable
      });
    } else {
      return Comp;
    }
  }
);

RenderLearningItem.displayName = 'RenderLearningItem';

const LearningItem = ({
  id,
  render,
  type,
  li,
  onCreate,
  meta,
  clickZoomable
}: {
  id?: string,
  render?: Function,
  type?: string,
  li?: string,
  onCreate?: Function,
  meta?: Object,
  clickZoomable?: boolean
}) => {
  if (type === 'create') {
    if (li) {
      const liT = learningItemTypesObj[li];
      if (liT.create) {
        const ToRun = liT.create;
        return (
          <ToRun
            uploadFn={uploadFile}
            createLearningItem={(liType, item) =>
              createLearningItem(liType, item, meta)
            }
            onCreate={onCreate}
            LearningItem={LearningItem}
          />
        );
      } else {
        const lid = createLearningItem(liT.id, liT.dataStructure, meta);
        return (
          <div style={{ marginLeft: '10px' }}>
            <LearningItem id={lid} type="edit" meta={meta} />
            <Button color="primary" onClick={() => onCreate && onCreate(lid)}>
              Add
            </Button>
          </div>
        );
      }
    } else {
      return <LearningItemChooser onCreate={onCreate} meta={meta} />;
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
