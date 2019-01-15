// @flow

import * as React from 'react';
import { toJS } from 'mobx';
import { Provider } from 'mobx-react';
import { omit, isEqual } from 'lodash';
import { DraggableCore } from 'react-draggable';
import InsertLink from '@material-ui/icons/InsertLink';
import NoteAdd from '@material-ui/icons/NoteAdd';
import LearningItem from './index';

import { learningItemTypesObj } from '/imports/activityTypes';
import { connect, listore } from './store';

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

  mounted: boolean;

  ref: any;

  componentDidMount = () => (this.mounted = true);

  componentWillUnmount = () => (this.mounted = false);

  constructor(props: any) {
    super(props);
    this.ref = React.createRef();
    this.state = { open: false };
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

  onDrop = (e: *) => {
    if (this.ref?.current) {
      this.ref.current.onDrop(toJS(e.item));
    }
  };

  shouldComponentUpdate(nextProps: any, nextState: any) {
    const { open } = this.state;

    return (
      !isEqual(omit(nextProps, 'dataFn'), omit(this.props, 'dataFn')) ||
      nextState.open !== open
    );
  }

  render() {
    const {
      disableDragging,
      render,
      type,
      search,
      data,
      dataFn,
      isPlayback,
      id
    } = this.props;
    console.log(data);

    if (!this.Comp) {
      return '<h2>Error</h2>';
    }
    const liType = learningItemTypesObj[data.liType];
    if (
      liType.dataStructure &&
      this.props.notEmpty &&
      isEqual(data.payload, liType.dataStructure)
    ) {
      return null;
    }

    if (search) {
      if (!liType.search || !liType.search(data.payload, search)) {
        return null;
      }
    }

    const Comp = this.Comp;
    const CompProps = (
      <div style={{ height: '100%' }}>
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
          <div
            style={{
              zIndex: this.state.dragging ? 99 : 'auto',
              height: '100%'
            }}
          >
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
              style={{ height: '100%' }}
            >
              <Comp
                userId={dataFn?.meta?.createdByUser}
                data={data.payload}
                isPlayback={isPlayback}
                dataFn={dataFn && dataFn.specialize('payload')}
                LearningItem={dataFn && dataFn.LearningItem}
                search={search && search.toLowerCase()}
                ref={liType.canDropLI ? this.ref : undefined}
                open={open}
                type={type}
                setOpen={e => this.setState({ open: e })}
              />
            </div>
          </div>
        </DraggableCore>
        <WrappedDragIcon />
      </div>
    );

    if (render) {
      return render({
        children: CompProps,
        dataFn,
        data,
        editable: liType.Editor,
        zoomable: liType.Viewer,
        liType: liType.id
      });
    } else {
      return CompProps;
    }
  }
}

export default RenderLearningItem;
