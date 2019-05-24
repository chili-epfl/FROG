// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { activityTypes } from '/imports/activityTypes';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';

const style = {
  card: {
    minWidth: 275,
    maxWidth: 900,
    margin: 'auto',
    marginTop: 16,
    marginBottom: 16,
    padding: 16
  },
  welcome_card: {
    minWidth: 275,
    maxWidth: 900,
    minHeight: 500,
    margin: 'auto',
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    backgroundImage: "url('/table_bg.png')",
    backgroundPosition: 'right bottom',
    backgroundRepeat: 'no-repeat'
  },
  icon: {
    height: 96,
    width: 96,
    left: '50%',
    transform: 'translateX(-50%)'
  },
  shortDesc: {
    position: 'inherit'
  },
  button: {
    right: 0
  },
  tile: {
    background: 'rgba(0, 0, 0, 0.3)',
    backgroundClip: 'content-box'
  },
  navbar: {
    flexDirection: 'row-reverse'
  },
  logo: {
    position: 'absolute',
    left: 16
  }
};

type StateT = {
  stage: number,
  config: Object
};

type PropsT = {
  classes: Object
};

class Welcome extends React.Component<PropsT, StateT> {
  render() {
    const { classes } = this.props;
    return (
      <Card raised className={classes.welcome_card}>
        <Typography variant="h3" component="h2">
          Welcome to FROG!
        </Typography>
        <Typography variant="h4" component="h3">
          FROG is a tool to improve the way you present your lecture You can use
          these activities to make your classroom interactive while having a
          full control over the progress of the class and all it takes is 3
          steps!
        </Typography>
      </Card>
    );
  }
}

class ChooseActivityType extends React.Component<
  {
    onSubmit: Function,
    ...PropsT
  },
  { config: Object }
> {
  constructor(props) {
    super(props);
    this.state = {
      config: {}
    };
  }

  render() {
    const { classes, onSubmit } = this.props;
    const { config } = this.state;
    const allowed = [
      'ac-quiz',
      'ac-ck-board',
      'ac-chat',
      'ac-brainstorm',
      'ac-ranking',
      'ac-video'
    ];
    const list = activityTypes.filter(x => allowed.includes(x.id));
    console.log(list);
    return (
      <Card raised className={classes.card}>
        <Typography variant="h5" component="h2">
          Let's start by choosing an activity type
        </Typography>
        <GridList cols="4" spacing="8">
          {list.map(x => (
            <a
              href={'#'}
              onClick={e => {
                e.preventDefault();
                onSubmit(x);
              }}
            >
              <GridListTile key={x.id} classes={{ root: classes.tile }}>
                <img
                  src={'/' + x.id + '.png'}
                  alt={x.id}
                  className={classes.icon}
                />
                <GridListTileBar
                  title={x.meta.name}
                  subtitle={<span>{x.meta.shortDesc}</span>}
                  classes={{ root: classes.shortDesc }}
                />
              </GridListTile>
            </a>
          ))}
        </GridList>
      </Card>
    );
  }
}

class ConfigPanel extends React.Component<
  { activityType: Object, classes: Object },
  { activity: Object }
> {
  constructor(props) {
    super(props);
    this.state = {
      activity: this.props.activityType
    };
  }

  render() {
    const { id, config } = this.props.activityType;
    const { classes } = this.props;
    return (
      <Card raised className={classes.card}>
        <ApiForm
          activityType={id}
          config={config}
          onConfigChange={x => this.setState({activity: x})}
          hidePreview
          noOffset
        />
      </Card>
    );
  }
}

class SingleActivity extends React.Component<PropsT, StateT> {
  constructor(props) {
    super(props);
    this.state = {
      stage: 1,
      config: {}
    };
  }

  render() {
    const { classes } = this.props;
    const { stage, config } = this.state;
    return (
      <>
        <AppBar position="static" color="default">
          <Toolbar classes={{ root: classes.navbar }}>
            <Typography variant="h6" color="inherit" className={classes.logo}>
              FROG
            </Typography>
            <Button size="medium">Help</Button>
            <Button size="medium">Log In/Sign Up</Button>
          </Toolbar>
        </AppBar>
        <Grow in={stage === 1} unmountOnExit>
          <Welcome classes={classes} />
          {/* Currently, selecting and configuring activity are handled by a
          single screenplan to separate but gets too complicated */}
          {/* The function to generate the activity must be called here and the 2 urls returned. */}
        </Grow>
        <Grow in={stage === 1} unmountOnExit>
          <ChooseActivityType
            classes={classes}
            onSubmit={conf =>
              this.setState({ stage: this.state.stage + 1, config: conf })
            }
          />
        </Grow>
        <Grow in={stage === 2} unmountOnExit>
          <ConfigPanel activityType={config} classes={classes} />
        </Grow>
      </>
    );
  }
}

export default withStyles(style)(SingleActivity);
