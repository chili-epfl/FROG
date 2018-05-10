// @flow
import * as React from 'react';

import { Meteor } from 'meteor/meteor';
import { CircularProgress } from 'material-ui/Progress';
import { isBrowser } from 'frog-utils';

import RenderLearningItem from './RenderLearningItem';

if (isBrowser) {
  require('./sliderCSS');
}

const Slider = isBrowser
  ? require('rc-slider').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

type PropsT = { id: string, render?: Function };

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

  getRevisions = (id: string) =>
    Meteor.call('sharedb.get.revisions', 'id', id, (_, res) =>
      this.setState({ revisions: res, currentRev: res.length - 1 })
    );

  render() {
    if (this.state.revisions.length === 0) {
      return <CircularProgress />;
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

export default LearningItemWithSlider;
