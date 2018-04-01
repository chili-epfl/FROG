// @flow
import * as React from 'react';
import { omit } from 'lodash';
import { ReactiveText, uuid } from 'frog-utils';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import { withState } from 'recompose';

import ReactiveHOC from './ReactiveHOC';
import fileLI from '../../internalLearningItems/li-file';
import { connection } from '../App/connection';
import { uploadFile } from '../../api/openUploads';
import LearningItemChooser from './LearningItemChooser';

const viewIdea = ({ data }) => (
  <React.Fragment>
    <b>{data.title}</b>
    <br />
    {data.content}
  </React.Fragment>
);

const editIdea = ({ dataFn }) => (
  <div className="bootstrap">
    <b>Title:</b>
    <br />
    <ReactiveText
      path="title"
      dataFn={dataFn}
      style={{ width: '80%', height: '100%', fontSize: '20px' }}
    />
    <br />
    <b>Content:</b>
    <br />
    <ReactiveText
      path="content"
      type="textarea"
      dataFn={dataFn}
      style={{ width: '80%', height: '100%', fontSize: '20px' }}
    />
  </div>
);

const ideaLI = {
  viewThumb: viewIdea,
  editable: true,
  zoomable: false,
  edit: editIdea,
  name: 'Idea',
  id: 'li-idea',
  dataStructure: { title: '', content: '' }
};

export type learningItemTypeT = {
  name: string,
  id: string,
  dataStructure?: any,
  viewer?: React.ComponentType<any>,
  create?: React.ComponentType<any>,
  editor?: React.ComponentType<any>,
  editable: boolean,
  viewThumb: React.ComponentType<any>,
  zoomable: boolean,
  editor?: React.ComponentType<any>,
  editable: boolean
};

export const learningItemTypesObj: {
  [name: string]: learningItemTypeT
} = {
  'li-idea': ideaLI,
  'li-file': fileLI
};

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
    const Component = liType[type];
    if (!Component) {
      return (
        <b>Unsupported learning item type {JSON.stringify(data.liType)}</b>
      );
    } else {
      const Comp = (
        <React.Fragment>
          <span onClick={() => setOpen(true)}>
            <Component
              data={data.payload}
              dataFn={dataFn && dataFn.specialize('payload')}
            />
          </span>
          {(() => {
            if (
              open &&
              type === 'viewThumb' &&
              clickZoomable &&
              liType['view']
            ) {
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
