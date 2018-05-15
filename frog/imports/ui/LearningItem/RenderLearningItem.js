// @flow

import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import { omit, isEqual } from 'lodash';

import { learningItemTypesObj } from './learningItemTypes';

class RenderLearningItem extends React.Component<any, any> {
  state = { open: false };

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
        <span onClick={() => this.setState({ open: true })}>
          <LIComponent
            data={data.payload}
            dataFn={dataFn && dataFn.specialize('payload')}
            LearningItem={dataFn && dataFn.LearningItem}
          />
        </span>
        {(() => {
          if (
            this.state.open &&
            type === 'thumbView' &&
            clickZoomable &&
            liType.Viewer
          ) {
            const View = liType.Viewer;
            return (
              <Dialog open onClose={() => this.setState({ open: false })}>
                <View
                  data={data.payload}
                  LearningItem={dataFn && dataFn.LearningItem}
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
