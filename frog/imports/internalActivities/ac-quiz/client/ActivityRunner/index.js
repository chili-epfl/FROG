// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {getUsername} from '/imports/api/users'
import { Sessions } from '/imports/api/sessions';
import { type ActivityRunnerPropsT, HTML } from '/imports/frog-utils';

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

  // added a help button in this render method
  render() {
    const { classes, ...propsNoClasses } = this.props;
    const { activityData, data, dataFn } = propsNoClasses;
    const { title, guidelines } = activityData.config;
    const sendStuckSignalToCellulo = (studentUsername)=> {
      // get the MRO (most recently opened) started session
      let mroSession = Sessions.findOne({state:  { $in: ['STARTED', 'READY', 'PAUSED'] }   }, { sort: { startedAt: -1 } })
      try { 
        Meteor.call('ws.send', mroSession.slug, "stuck "+studentUsername);
      }catch(err){
    
      }
    }
    return (
      <div className={classes.main}>
        { 
          <button onClick={() => { console.log("user "+getUsername() + " has requested help"); 
                                   sendStuckSignalToCellulo(getUsername()) 
                                 }
                          }>
            Request help
          </button>
        }
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
