// @flow
import * as React from 'react';
import { uuid } from 'frog-utils';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import { withState } from 'recompose';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { omit } from 'lodash';
import Spinner from 'react-spinner';
import { Meteor } from 'meteor/meteor';

import ReactiveHOC from './ReactiveHOC';
import { connection } from '../App/connection';
import { uploadFile } from '../../api/openUploads';
import LearningItemChooser from './LearningItemChooser';
import { learningItemTypesObj } from './learningItemTypes';

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
        meta: { id: dataFn && dataFn.doc.id, ...omit(data, 'payload') },
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

class LearningItemWithSlider extends React.Component<
  any,
  { revisions: Object[], currentRev: number }
> {
  constructor(props) {
    super(props);
    this.state = { revisions: [], currentRev: 0 };
  }

  componentDidMount() {
    Meteor.call('sharedb.get.revisions', 'li', this.props.id, (_, res) =>
      this.setState({ revisions: res, currentRev: res.length - 1 })
    );
  }

  componentWillReceiveProps(nextProps) {
    Meteor.call('sharedb.get.revisions', 'li', nextProps.id, (_, res) =>
      this.setState({ revisions: res, currentRev: res.length - 1 })
    );
  }

  render() {
    if (this.state.revisions.length === 0) {
      return <Spinner />;
    }
    return (
      <div>
        <Slider
          value={this.state.currentRev}
          min={0}
          max={this.state.revisions.length - 1}
          onChange={e => this.setState({ currentRev: e })}
        />
        <RenderLearningItem
          type="view"
          id={this.props.id}
          render={this.props.render}
          data={this.state.revisions[this.state.currentRev]}
        />
      </div>
    );
  }
}

RenderLearningItem.displayName = 'RenderLearningItem';

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
              dataFn.createLearningItem(liType, item, meta)
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
