// @flow
import * as React from 'react';

import { Meteor } from 'meteor/meteor';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isBrowser, type LIRenderT } from 'frog-utils';
import json from 'ot-json0';
import { isEmpty, cloneDeep } from 'lodash';

import RenderLearningItem from './RenderLearningItem';

if (isBrowser) {
  require('./sliderCSS');
}

const Slider = isBrowser
  ? require('rc-slider').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

type PropsT = { id: string, render?: LIRenderT, dataFn?: Object };

class LearningItemWithSlider extends React.Component<
  PropsT,
  {
    revisions: Object[],
    currentRev: number
  }
> {
  constructor(props: PropsT) {
    super(props);
    this.state = { revisions: [], currentRev: 0 };
  }

  componentDidMount() {
    this.getRevisions(this.props.id);
  }

  componentWillReceiveProps(nextProps: PropsT) {
    if (this.props.id !== nextProps.id) {
      this.getRevisions(nextProps.id);
    }
  }

  getRevisions = (id: string) => {
    if (this.props.dataFn && this.props.dataFn.backend) {
      this.props.dataFn.backend.db.getOps('li', id, 0, null, {}, (err, res) => {
        if (err || isEmpty(res)) {
          return [];
        }
        const beg = res.shift().create.data;
        const revisions = res.reduce(
          (acc, x) => {
            const result = json.type.apply(
              cloneDeep(acc[acc.length - 1]),
              x.op
            );
            return [...acc, result];
          },
          [beg]
        );
        this.setState({ revisions, currentRev: revisions.length - 1 });
      });
    } else {
      Meteor.call('sharedb.get.revisions', 'li', id, (_, res) =>
        this.setState({ revisions: res, currentRev: res.length - 1 })
      );
    }
  };

  render() {
    if (this.state.revisions.length === 0) {
      return <CircularProgress />;
    }
    return (
      <React.Fragment>
        <Slider
          style={{ width: '95%', margin: '0 auto' }}
          value={this.state.currentRev}
          min={0}
          max={this.state.revisions.length - 1}
          onChange={e => this.setState({ currentRev: e })}
        />
        <RenderLearningItem
          type="view"
          key={this.state.currentRev}
          id={this.props.id}
          render={this.props.render}
          dataFn={this.props.dataFn}
          isPlayback
          data={this.state.revisions[this.state.currentRev]}
        />
      </React.Fragment>
    );
  }
}

export default LearningItemWithSlider;
