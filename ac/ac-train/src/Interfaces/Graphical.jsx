import React from 'react';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Paper from 'material-ui/Paper';
import update from 'immutability-helper';

import { travelClass, fares, travel } from '../ActivityUtils';

const styles = theme => ({
  root: {},
  formControls: {
    display: 'flex',
    flexDirection: 'column',
    padding: '100px'
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  },
  map: {
    width: '100%',
    height: 'auto'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit
  }
});

const coordinates = [
  { id: 'lucerne', minX: 510, maxX: 520, minY: 384, maxY: 394 },
  { id: 'lausanne', minX: 182, maxX: 192, minY: 533, maxY: 543 }
];

const findInRange = (x, y) => {
  //   console.log(x, y);
  for (let i = 0; i < coordinates.length; i += 1) {
    const index = coordinates[i];

    if (
      x >= index.minX &&
      x <= index.maxX &&
      y >= index.minY &&
      y <= index.maxY
    ) {
      return index.id;
    }
    // console.log(index);
  }

  return false;
};

const RadioGroupElements = ({ radioGroups, classes, answer, onRadio }) => (
  <Grid container>
    {radioGroups.map(group => (
      <Grid key={group.id} item sm={3}>
        <FormControl
          component="fieldset"
          required
          className={classes.formControl}
        >
          <FormLabel component="legend">{group.id}</FormLabel>
          <RadioGroup
            aria-label={group.id}
            name={group.id}
            className={classes.group}
            value={answer[group.id]}
            onChange={onRadio(group.id)}
          >
            {group.values.map(item => (
              <FormControlLabel
                key={item}
                value={item}
                control={<Radio />}
                label={item}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
    ))}
  </Grid>
);

const FromToInputs = ({ answer, onFocus, classes }) => (
  <Grid container>
    <Grid item sm={12}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="from">From</InputLabel>
        <Input id="from" value={answer.from} onClick={onFocus('from')} />
      </FormControl>
    </Grid>
    <Grid item sm={12}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="to">To</InputLabel>
        <Input id="to" value={answer.to} onClick={onFocus('to')} />
      </FormControl>
    </Grid>
  </Grid>
);

class Graphical extends React.Component {
  state = {
    answer: {
      from: '------',
      to: '-------',
      travel: '------',
      class: '',
      fare: '',
      bike: false
    },
    input: false,
    radioGroups: [
      { id: 'travel', values: travel },
      { id: 'fare', values: fares },
      { id: 'class', values: travelClass },
      { id: 'bike', values: ['yes', 'no'] }
    ]
  };

  handleRadio = name => event => {
    const answer = { ...this.state.answer };
    answer[name] = event.target.value;
    this.setState({ answer });
  };

  handleClick = event => {
    const { clientX, clientY } = event;

    if (this.state.input) {
      const id = findInRange(clientX, clientY);
      const answer = { ...this.state.answer };
      answer[this.state.input] = id;

      if (id) {
        this.setState({
          answer,
          input: false
        });
      }
    }
  };

  onFocus = focusedInput => () => {
    this.setState({ input: focusedInput });
  };

  handleSubmit = () => {
    console.log(this.state.answer);
    this.props.submit();
  };

  render() {
    const { ticket, classes } = this.props;
    const { radioGroups } = this.state;

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Typography gutterBottom>{ticket}</Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <img
              id="map"
              src="/train/swiss_map_2.jpg"
              className={classes.map}
              style={{ cursor: this.state.input ? 'pointer' : 'not-allowed' }}
              alt="swiss_map"
              onClick={this.handleClick}
            />
          </Grid>
          <Grid item sm={12}>
            <Grid container>
              <Grid item sm={3}>
                <FromToInputs
                  classes={classes}
                  answer={this.state.answer}
                  onFocus={this.onFocus}
                />
              </Grid>
              <Grid item sm={9}>
                <RadioGroupElements
                  classes={classes}
                  radioGroups={radioGroups}
                  answer={this.state.answer}
                  onRadio={this.handleRadio}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button color="primary" onClick={this.handleSubmit}>
              Buy
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Graphical);
