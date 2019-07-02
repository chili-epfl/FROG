// @flow

import React from 'react';
import Grow from '@material-ui/core/Grow';
import TopBar from './TopBar';
import Welcome from './Welcome';
import ChooseActivityType from './ChooseActivityType';
import ConfigPanel from './ConfigPanel';
import Loading from './Loading';
import Finish from './Finish';
import { type StateT } from './types';

/**
 * The main class for the Single Activity
 */
class SingleActivity extends React.Component<{}, StateT> {
  constructor() {
    super();
    this.state = {
      stage: 1
    };
  }

  render() {
    const { stage, slug, activityType } = this.state;
    return (
      <>
        <TopBar />
        <Grow in={stage === 1} unmountOnExit>
          <Welcome />
        </Grow>
        <Grow in={stage === 1} unmountOnExit>
          <ChooseActivityType
            onSubmit={conf =>
              this.setState({ stage: this.state.stage + 1, activityType: conf })
            }
          />
        </Grow>
        <Grow in={stage === 2} unmountOnExit>
          <ConfigPanel
            activityType={activityType}
            onSubmit={conf => {
              this.setState({ stage: this.state.stage + 1, activity: conf });
              Meteor.call(
                'create.graph.from.activity',
                conf.activityType,
                conf.config,
                3,
                (err, res) => {
                  if (err) {
                    window.alert(
                      'Could not create your activity, please try later.'
                    );
                    this.setState({ stage: this.state.stage - 1 });
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
          <Loading />
        </Grow>
        <Grow in={stage === 4} unmountOnExit>
          <Finish
            url={{
              public: slug,
              dashboard: 'teacher/orchestration/' + slug
            }}
            onReturn={() => this.setState({ stage: this.state.stage - 2 })}
          />
        </Grow>
      </>
    );
  }
}
export default SingleActivity;
