// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { type ActivityRunnerPropsT, HTML } from 'frog-utils';

import Quiz from './Quiz';

const styles = () => ({
  main: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fdfdfd'
  },
  container: {
    maxWidth: '100%',
    width: '500px',
    margin: '5px',
    padding: '5px',
    flex: '0 1 auto'
  }
});

const Completed = ({ back }) => (
  <>
    <h1>Completed!</h1>
    <Button color="primary" onClick={back}>
      Go back
    </Button>
  </>
);

class ActivityRunner extends React.Component<
  ActivityRunnerPropsT & { classes: Object }
> {
  componentDidMount() {
    this.props.logger({ type: 'progress', value: 0 });
  }

  render() {
    const { classes, ...propsNoClasses } = this.props;
    const { activityData, data, dataFn } = propsNoClasses;
    const { title, guidelines } = activityData.config;
    return (
      <div className={classes.main}>
        {title && title !== '' && <h1>{title}</h1>}
        {guidelines && guidelines !== '<p><br></p>' && (
          <div className={classes.container}>
            <HTML html={guidelines} />
          </div>
        )}
        <div className={classes.container}>
          {data.completed ? (
            <Completed back={() => dataFn.objInsert(false, ['completed'])} />
          ) : (
            <Quiz {...propsNoClasses} />
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ActivityRunner);
