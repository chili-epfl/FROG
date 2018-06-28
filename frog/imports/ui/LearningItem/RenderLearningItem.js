// @flow

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { DraggableCore } from 'react-draggable';
import { listore } from './store';

import { learningItemTypesObj } from '../../activityTypes';

const MaybeClickable = ({ condition, children, onClick }) =>
  condition ? <div onClick={onClick}>{children}</div> : children;

class RenderLearningItem extends React.Component<any, any> {
  state = { open: false, dragging: false };
  mounted: boolean;

  componentDidMount = () => (this.mounted = true);

  componentWillUnmount = () => {
    this.mounted = false;
  };

  render() {
    const {
      data,
      dataFn,
      render,
      id,
      type = 'view',
      clickZoomable,
      disableDragging
    } = this.props;
    const liType = learningItemTypesObj[data.liType];
    if (!liType) {
      return <h3>Oops ! Incorrect LI-type</h3>;
    }
    let LIComponent;
    if ((type === 'view' || type === 'history') && liType.Viewer) {
      LIComponent = liType.Viewer;
    } else if (
      (type === 'view' || type === 'history' || type === 'thumbView') &&
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
      <>
        <MaybeClickable
          onClick={() => {
            if (this.mounted && !this.state.dragging) {
              this.setState({ open: true });
            }
          }}
          condition={type === 'thumbView' && clickZoomable && liType.Viewer}
        >
          <DraggableCore
            disabled={type === 'edit' || type === 'history' || disableDragging}
            offsetParent={document.body}
            onStart={e => e.preventDefault()}
            onDrag={(e, d) => {
              listore.setXY(d.x, d.y);
              listore.setDraggedItem(id, e.shiftKey);
              this.setState({ dragging: true });
            }}
            onStop={() => {
              listore.stopDragging();
              this.setState({ dragging: false });
              return false;
            }}
          >
            <div style={{ zIndex: this.state.dragging ? 99 : 'auto' }}>
              <LIComponent
                data={data.payload}
                dataFn={dataFn && dataFn.specialize('payload')}
                LearningItem={dataFn && dataFn.LearningItem}
              />
            </div>
          </DraggableCore>
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
      </>
    );
    if (render) {
      return render({
        dataFn,
        children: Comp,
        editable: liType.Editor,
        zoomable: liType.Viewer,
        liType: liType.id,
        meta: data
      });
    } else {
      return Comp;
    }
  }
}

export default RenderLearningItem;
