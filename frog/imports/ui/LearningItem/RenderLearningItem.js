// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import Dialog from '@material-ui/core/Dialog';
import { omit, isEqual } from 'lodash';
import { Provider } from 'mobx-react';
import { getDisplayName } from 'frog-utils';
import { toClass } from 'recompose';
import { DraggableCore } from 'react-draggable';
import InsertLink from '@material-ui/icons/InsertLink';
import NoteAdd from '@material-ui/icons/NoteAdd';

import { learningItemTypesObj } from '../../activityTypes';
import { connect, listore } from './store';

const MaybeClickable = ({ condition, children, onClick }) =>
  condition ? <span onClick={onClick}>{children}</span> : children;

const DragIconRaw = ({ store }) =>
  store.dragState && (
    <div
      style={{
        position: 'fixed',
        zIndex: 99,
        top: store.coords[1],
        left: store.coords[0],
        pointerEvents: 'none'
      }}
    >
      {store.dragState.shiftKey ? (
        <NoteAdd style={{ fontSize: 36 }} />
      ) : (
        <InsertLink style={{ fontSize: 36 }} />
      )}
    </div>
  );

const DragIcon = connect(DragIconRaw);

const WrappedDragIcon = props => (
  <Provider store={listore}>
    <DragIcon {...props} />
  </Provider>
);

class RenderLearningItem extends React.Component<any, any> {
  Comp: any;
  ref: any;
  mounted: boolean;
  componentDidMount = () => (this.mounted = true);
  componentWillUnmount = () => (this.mounted = false);

  constructor(props: any) {
    super(props);
    this.ref = React.createRef();
    this.state = { selected: false, open: false };
    const { data, type = 'view' } = props;
    const liType = learningItemTypesObj[data.liType];
    if (!liType) {
      this.Comp = () => <h3>Oops ! Incorrect LI-type</h3>;
    }
    if (type === 'view' && liType.Viewer) {
      this.Comp = liType.Viewer;
    } else if (
      (type === 'view' || type === 'thumbView') &&
      liType.ThumbViewer
    ) {
      this.Comp = liType.ThumbViewer;
    } else if (type === 'edit' && liType.Editor) {
      this.Comp = liType.Editor;
    } else {
      this.Comp = () => (
        <b>
          Unsupported learning item type {JSON.stringify(data.liType)} or
          component type {type}
        </b>
      );
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      !isEqual(omit(nextProps, 'dataFn'), omit(this.props, 'dataFn')) ||
      nextState.open !== this.state.open
    );
  }

  onDrop = (e: *) => {
    if (this.ref?.current) {
      this.ref.current.onDrop(e.item);
    }
  };

  render() {
    const {
      render,
      disableDragging,
      type,
      data,
      dataFn,
      isPlayback,
      id
    } = this.props;
    const liType = learningItemTypesObj[data.liType];
    const LIComp = this.Comp;
    LIComp.displayName = liType.id + '-' + type;
    const Comp = (
      <>
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
            <div
              onMouseOver={() => {
                if (this.mounted && listore.dragState && liType.canDropLI) {
                  this.setState({ selected: true });
                  listore.setOverCB(this.onDrop);
                }
              }}
              onMouseLeave={() => {
                if (this.mounted && liType.canDropLI) {
                  this.setState({ selected: false });
                  listore.setOverCB(null);
                }
              }}
            >
              <LIComp
                userId={dataFn.meta?.createdByUser}
                data={data.payload}
                isPlayback={isPlayback}
                dataFn={dataFn && dataFn.specialize('payload')}
                LearningItem={dataFn && dataFn.LearningItem}
                ref={liType.canDropLI ? this.ref : undefined}
                open={this.state.open}
                type={type}
                setOpen={e => this.setState({ open: e })}
              />
            </div>
          </div>
        </DraggableCore>
        <WrappedDragIcon />
      </>
    );

    if (render) {
      return render({
        dataFn,
        data,
        editable: liType.Editor,
        zoomable: liType.Viewer,
        liType: liType.id,
        children: Comp
      });
    } else {
      return Comp;
    }
  }
}

export default RenderLearningItem;
