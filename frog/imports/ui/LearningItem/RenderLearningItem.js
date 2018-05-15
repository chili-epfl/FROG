// @flow

import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import { omit, isEqual } from 'lodash';

import { learningItemTypesObj } from './learningItemTypes';

const mapping = { view: 'Viewer', edit: 'Editor', thumbView: 'ThumbViewer' };
class RenderLearningItem extends React.Component<any, any> {
  state = { open: false };

  shouldComponentUpdate(nextProps: any) {
    return !isEqual(omit(nextProps, 'dataFn'), omit(this.props, 'dataFn'));
  }

  render() {
    const { data, dataFn, render, type = 'view', clickZoomable } = this.props;

    const liType = learningItemTypesObj[data.liType];
    if (!liType) {
      return <h1>Upz</h1>;
    }
    let Component = liType[mapping[type]];
    if (!Component) {
      if (type === 'view' && liType.ThumbViewer) {
        Component = liType.ThumbViewer;
      } else {
        return (
          <b>
            Unsupported learning item type {JSON.stringify(data.liType)} or
            component type {type}
          </b>
        );
      }
    }
    const Comp = (
      <React.Fragment>
        <span onClick={() => this.setState({ open: true })}>
          <Component
            data={data.payload}
            dataFn={dataFn && dataFn.specialize('payload')}
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
