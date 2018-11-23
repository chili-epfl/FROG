import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = {
  buttonContainer: {
    marginBottom: '5px',
    marginTop: '25px',
    marginLeft: '25%',
    marginRight: '25%',
    width: '50%',
    height: '20%'
  },
  button: {
    fontSize: '20px',
    height: '45px',
    marginLeft: '2%',
    marginRight: '2%',
    textAlign: 'center',
    width: '46%'
  }
};

type ButtonsPropsT = {
  disableButtons: boolean,
  round: number
};
type StyledButtonsPropsT = ButtonsPropsT & { classes: Object };

const clickHandler = (props, round, cooperate) => {
  props.dataFn.objInsert(cooperate, [
    'rounds',
    (round - 1).toString(),
    props.id
  ]);
};

const ActionButton = ({
  props,
  classes,
  label,
  disabled,
  round,
  cooperate
}) => (
  <Button
    variant="outlined"
    className={classes.button}
    disabled={disabled}
    onClick={() => clickHandler(props, round, cooperate)}
  >
    {label}
  </Button>
);

const ButtonsController = (props: StyledButtonsPropsT) => (
  <div className={props.classes.buttonContainer}>
    <ActionButton
      label="Cooperate"
      disabled={props.disableButtons}
      round={props.round}
      classes={props.classes}
      props={props}
      cooperate
    />
    <ActionButton
      label="Cheat"
      disabled={props.disableButtons}
      props={props}
      round={props.round}
      classes={props.classes}
    />
  </div>
);

const StyledButtons = withStyles(styles)(ButtonsController);
const Buttons: ActivityRunnerT = (props: ButtonsPropsT) => (
  <StyledButtons {...props} />
);

export default Buttons;
