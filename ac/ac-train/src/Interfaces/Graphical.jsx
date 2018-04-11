// @flow
import React from 'react';
import ReactCursorPosition from 'react-cursor-position';

// UI
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

// Interal Imports
import Help from './Help';
import { GraphicGuidelines } from '../Guidelines';
import {
  FARES,
  CLASS,
  TRAVELDIRECTION,
  WANTBIKE,
  capitalizeFirstLetter
} from '../ActivityUtils';

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
  { id: 'geneva', minX: 46, maxX: 56, minY: 755, maxY: 765 },
  { id: 'lausanne', minX: 146, maxX: 166, minY: 598, maxY: 618 },
  { id: 'fribourg', minX: 255, maxX: 275, minY: 480, maxY: 500 },
  { id: 'basel', minX: 350, maxX: 370, minY: 134, maxY: 154 },
  { id: 'neuchatel', minX: 205, maxX: 225, minY: 390, maxY: 410 }
];

const findInRange = (x, y) => {
  console.log(x, y);
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
    <Grid item sm={6}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="from">From</InputLabel>
        <Input id="from" value={answer.from} onClick={onFocus('from')} />
      </FormControl>
    </Grid>
    <Grid item sm={6}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="to">To</InputLabel>
        <Input id="to" value={answer.to} onClick={onFocus('to')} />
      </FormControl>
    </Grid>
  </Grid>
);

const SwissMap = ({
  classes,
  canSelectCity,
  position,
  elementDimensions,
  onClickCity
}) => {
  return (
    <img
      id="map"
      src="/train/swiss_map_2.jpg"
      className={classes.map}
      alt="swiss_map"
      style={{ cursor: canSelectCity ? 'pointer' : 'not-allowed' }}
      onClick={onClickCity(position, elementDimensions)}
    />
  );
};

type StateT = {
  answer: {
    from: string,
    to: string,
    travel: string,
    class: string,
    fare: string,
    bike: false
  },
  input: {
    which: string,
    switch: boolean
  }
};

type PropsT = {
  ticket: string,
  submit: Function,
  helpOpen: Function,
  helpClose: Function,
  help: boolean,
  classes: Object
};

class Graphical extends React.Component<PropsT, StateT> {
  state = {
    answer: {
      from: '',
      to: '',
      travel: '',
      class: '',
      fare: '',
      bike: false
    },
    input: {
      which: '',
      switch: false
    },
    radioGroups: [
      { id: 'travel', values: TRAVELDIRECTION },
      { id: 'fare', values: FARES },
      { id: 'class', values: CLASS },
      { id: 'bike', values: WANTBIKE }
    ]
  };

  handleRadio = name => event => {
    const answer = { ...this.state.answer };
    answer[name] = event.target.value;
    this.setState({ answer });
  };

  handleClickCity = (position, dimension) => () => {
    const { x, y } = position;
    const { width, height } = dimension;

    const normX = Math.round(x / width * 1000);
    const normY = Math.round(y / height * 1000);

    if (this.state.input.switch) {
      const id = findInRange(normX, normY);
      const answer = { ...this.state.answer };
      answer.input.which = id;

      if (id) {
        this.setState({ answer });
      }
      this.setState({ input: { which: '', switch: false } });
    }
  };

  onFocus = focusedInput => () => {
    this.setState({ input: { which: focusedInput, switch: true } });
  };

  handleSubmit = () => {
    this.props.submit(this.state.answer);
  };

  render() {
    const { ticket, helpOpen, helpClose, help, classes } = this.props;
    const { radioGroups } = this.state;

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Typography gutterBottom>{ticket}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ReactCursorPosition>
              <SwissMap
                classes={classes}
                canSelectCity={this.state.input}
                onClickCity={this.handleClickCity}
              />
            </ReactCursorPosition>
          </Grid>
          <Grid item sm={6}>
            <Grid container>
              <Grid item sm={12}>
                <FromToInputs
                  classes={classes}
                  answer={this.state.answer}
                  onFocus={this.onFocus}
                />
              </Grid>
              <Grid item sm={12}>
                <RadioGroupElements
                  classes={classes}
                  radioGroups={radioGroups}
                  answer={this.state.answer}
                  onRadio={this.handleRadio}
                />
              </Grid>
            </Grid>
            <Grid item sm={12}>
              <Grid container>
                <Button
                  color="primary"
                  variant="raised"
                  onClick={this.handleSubmit}
                >
                  Buy
                </Button>
                <Help onOpen={helpOpen} onClose={helpClose} open={help}>
                  <GraphicGuidelines />
                </Help>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Graphical);
