// @flow

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { omit, isEqual } from 'lodash';
import { getDisplayName } from 'frog-utils';
import { toClass } from 'recompose';

import { learningItemTypesObj } from '/imports/activityTypes';

const MaybeClickable = ({ condition, children, onClick }) =>
  condition ? <span onClick={onClick}>{children}</span> : children;

const withNullCheck = ({
  render,
  renderArgs,
  isPlayback,
  type,
  clickZoomable,
  liType,
  data,
  dataFn,
  setOpen
}) => WrappedComponent => {
  // $FlowFixMe
  const WrappedComponentClass = toClass(WrappedComponent);
  // $FlowFixMe
  class NullChecker extends WrappedComponentClass<*, *> {
    render() {
      const result = super.render();

      if (!result) {
        return null;
      }

      const Comp = (
        <>
          <MaybeClickable
            onClick={() => {
              setOpen(true);
            }}
            condition={
              type === 'thumbView' && !!clickZoomable && !!liType.Viewer
            }
          >
            {result}
          </MaybeClickable>
          {this.props.open &&
            liType.Viewer && (
              <Dialog
                maxWidth={false}
                open
                onClose={() => {
                  setOpen(false);
                }}
              >
                <liType.Viewer
                  type="view"
                  isPlayback={isPlayback}
                  data={data.payload}
                  dataFn={dataFn}
                  LearningItem={dataFn && dataFn.LearningItem}
                />
              </Dialog>
            )}
        </>
      );
      if (render) {
        return render({ ...renderArgs, children: Comp });
      } else {
        return Comp;
      }
    }
  }

  NullChecker.displayName = `withNullCheck(${getDisplayName(
    WrappedComponent
  )})`;
  return NullChecker;
};

class RenderLearningItem extends React.Component<any, any> {
  Comp: any;

  constructor(props: any) {
    super(props);
    this.state = { open: false };
    const {
      data,
      dataFn,
      render,
      type = 'view',
      clickZoomable,
      isPlayback
    } = props;
    const liType = learningItemTypesObj[data.liType];
    let LIComponent;
    if (!liType) {
      this.Comp = () => <h3>Oops ! Incorrect LI-type</h3>;
    }
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
      this.Comp = () => (
        <b>
          Unsupported learning item type {JSON.stringify(data.liType)} or
          component type {type}
        </b>
      );
    }
    if (!this.Comp && LIComponent) {
      this.Comp = withNullCheck({
        render,
        renderArgs: {
          dataFn,
          data,
          editable: liType.Editor,
          zoomable: liType.Viewer,
          liType: liType.id
        },
        dataFn,
        isPlayback,
        data,
        clickZoomable,
        liType,
        type,
        open: this.state.open,
        setOpen: e => this.setState({ open: e })
      })(LIComponent);
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      !isEqual(omit(nextProps, 'dataFn'), omit(this.props, 'dataFn')) ||
      nextState.open !== this.state.open
    );
  }

  render() {
    const { type, search, data, dataFn, isPlayback } = this.props;
    const Comp = this.Comp;
    return Comp ? (
      <Comp
        userId={dataFn?.meta?.createdByUser}
        data={data.payload}
        isPlayback={isPlayback}
        dataFn={dataFn && dataFn.specialize('payload')}
        LearningItem={dataFn && dataFn.LearningItem}
        search={search && search.toLowerCase()}
        open={this.state.open}
        type={type}
        setOpen={e => this.setState({ open: e })}
      />
    ) : (
      <h4>Error</h4>
    );
  }
}

export default RenderLearningItem;
