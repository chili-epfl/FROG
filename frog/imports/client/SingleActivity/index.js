// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
import Grow from '@material-ui/core/Grow';
import TopBar from './TopBar';
import Welcome from './Welcome';
import ChooseActivityType from './ChooseActivityType';
import ConfigPanel from './ConfigPanel';
import Loading from './Loading';
import Finish from './Finish';
import { style } from './style';
import { type StateT, type PropsT } from './types';

/**
 * The main class for the Single Activity
 */
class SingleActivity extends React.Component<PropsT, StateT> {
  constructor(props) {
    super(props);
    this.state = {
      stage: 1
    };
  }

  render() {
    const { classes } = this.props;
    const { stage, activityType } = this.state;
    return (
      <>
        <TopBar classes={classes} />
        <Grow in={stage === 1} unmountOnExit>
          <Welcome classes={classes} />
        </Grow>
        <Grow in={stage === 1} unmountOnExit>
          <ChooseActivityType
            classes={classes}
            onSubmit={conf =>
              this.setState({ stage: this.state.stage + 1, activityType: conf })
            }
          />
        </Grow>
        <Grow in={stage === 2} unmountOnExit>
          <ConfigPanel
            activityType={activityType}
            classes={classes}
            onSubmit={conf => {
              this.setState({ stage: this.state.stage + 1, activity: conf });
              Meteor.call(
                'create.graph.from.activity',
                conf.activityType,
                conf.config,
                3,
                (err, res) => {
                  if (err) {
                    // eslint-disable-next-line no-console
                    console.log(err);
                  } else {
                    this.setState({
                      stage: this.state.stage + 1,
                      slug: res.slug
                    });
                  }
                }
              );
            }}
            onReturn={() => this.setState({ stage: this.state.stage - 1 })}
          />
        </Grow>
        <Grow in={stage === 3} unmountOnExit>
          <Loading classes={classes} />
        </Grow>
        <Grow in={stage === 4} unmountOnExit>
          <Finish
            url={{
              public: this.state.slug,
              dashboard: 'teacher/orchestration/' + this.state.slug
            }}
            classes={classes}
            onReturn={() => this.setState({ stage: this.state.stage - 1 })}
          />
        </Grow>
      </>
    );
  }
}

export default withStyles(style)(SingleActivity);
