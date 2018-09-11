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

const Completed = ({ dataFn }) => (
  <React.Fragment>
    <h1>Completed!</h1>
    <Button
      color="primary"
      onClick={() => dataFn.objInsert(false, ['completed'])}
    >
      Go back
    </Button>
  </React.Fragment>
);

export default withStyles(styles)(
  ({ classes, ...props }: ActivityRunnerPropsT & { classes: Object }) => {
    const { activityData, data } = props;
    const {
      config: { title, guidelines }
    } = activityData;
    return (
      <div className={classes.main}>
        {title && title !== '' && <h1>{title}</h1>}
        {guidelines &&
          guidelines !== '<p><br></p>' && (
            <div className={classes.container}>
              <HTML html={guidelines} />
            </div>
          )}
        <div className={classes.container}>
          {data.completed ? <Completed {...props} /> : <Quiz {...props} />}
        </div>
      </div>
    );
  }
);
