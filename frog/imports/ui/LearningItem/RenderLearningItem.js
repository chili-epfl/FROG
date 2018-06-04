// @flow

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { omit, isEqual } from 'lodash';

import { learningItemTypesObj } from './learningItemTypes';

const MaybeClickable = ({ condition, children, onClick }) =>
  condition ? <span onClick={onClick}>{children}</span> : children;

class RenderLearningItem extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { open: false };
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      !isEqual(omit(nextProps, 'dataFn'), omit(this.props, 'dataFn')) ||
      nextState.open !== this.state.open
    );
  }

  render() {
    const { data, dataFn, render, type = 'view', clickZoomable } = this.props;
    const liType = learningItemTypesObj[data.liType];
    if (!liType) {
      return <h3>Oops ! Incorrect LI-type</h3>;
    }
    let LIComponent;
    if (type === 'view' && liType.Viewer) {
      LIComponent = liType.Viewer;
    } else if (
      (type === 'view' || type === 'thumbView') &&
      liType.ThumbViewer
    ) {
      LIComponent = liType.ThumbViewer;
    } else if (type === 'edit' && liType.Editor) {
      LIComponent = liType.Editor;
    } else {
      return (
        <b>
          Unsupported learning item type {JSON.stringify(data.liType)} or
          component type {type}
        </b>
      );
    }
    const Comp = (
      <React.Fragment>
        <MaybeClickable
          onClick={() => {
            this.setState({ open: true });
          }}
          condition={type === 'thumbView' && clickZoomable && liType.Viewer}
        >
          <LIComponent
            data={data.payload}
            dataFn={dataFn && dataFn.specialize('payload')}
            LearningItem={dataFn && dataFn.LearningItem}
          />
        </MaybeClickable>
        {this.state.open &&
          liType.Viewer && (
            <Dialog
              maxWidth={false}
              open
              onClose={() => {
                this.setState({ open: false });
              }}
            >
              <liType.Viewer
                data={data.payload}
                LearningItem={dataFn && dataFn.LearningItem}
              />
            </Dialog>
          )}
      </React.Fragment>
    );
    if (render) {
      return render({
        dataFn,
        children: Comp,
        editable: liType.Editor,
        zoomable: liType.Viewer,
        liType: liType.id
      });
    } else {
      return Comp;
    }
  }
}

export default RenderLearningItem;
