import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';

style = {
  card: {
    minWidth: 275,
    maxWidth: 900,
    margin: 'auto',
    marginBottom: 16,
    padding: 8
  }
};

type StateT = {
  stage: number,
  config: Object
};

type PropsT = {
  classes: Object
};

class Welcome extends React.Component<StateT, PropsT> {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes } = this.props;
    return (
      <Card raised className={classes.card}>
        <Typography variant="h5" component="h2">
          Welcome to FROG!
        </Typography>
        <Typography variant="h6" component="h3">
          FROG is a tool to improve the way you present your lecture You can use
          these activities to make your classroom interactive while having a
          full control over the progress of the class and all it takes is 3
          steps!
        </Typography>
      </Card>
    );
  }
}

class ChooseActivityType extends React.Component<{
  onSubmit: Function,
  ...PropsT
}> {
  constructor(props) {
    super(props);
    this.state = {
      config: {}
    };
  }
  render() {
    const { classes, onSubmit } = this.props;
    const { config } = this.state;
    return (
      <Card raised className={classes.card}>
        <Typography variant="h5" component="h2">
          Let's start by choosing an activity type
        </Typography>
        <ApiForm
          noOffset
          showDelete
          onConfigChange={e => this.setState({ config: e })}
        />
        <CardActions>
          <Button onClick={() => onSubmit(config)}>Next</Button>
        </CardActions>
      </Card>
    );
  }
}

class SingleActivity extends React.Component<StateT, PropsT> {
  constructor(props) {
    super(props);
    this.state = {
      stage: 1,
      config: {}
    };
  }

  render() {
    const { classes } = this.props;
    const { stage } = this.state;
    if (stage == 1)
      return (
        <>
          <Welcome classes={classes} />
          <ChooseActivityType
            classes={classes}
            onSubmit={conf =>
              this.setState({ stage: this.state.stage + 1, config: conf })
            }
            //The function to generate the activity must be called here and the 2 urls returned.
          />
        </>
      );
    else if (stage == 2) return <>OK</>;
    //This is just the last stage placeholder, will update it later.
  }
}

export default withStyles(style)(SingleActivity);
