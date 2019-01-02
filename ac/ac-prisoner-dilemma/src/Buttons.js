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
  id: string,
  dataFn: Object,
  disableButtons: boolean,
  round: number
};

type StyledButtonsPropsT = ButtonsPropsT & { classes: Object };

const ButtonsController = (props: StyledButtonsPropsT) => {
  const actions = ['Cooperate', 'Cheat'];

  return (
    <div className={props.classes.buttonContainer}>
      {actions.map(action => {
        const cooperate = action === 'Cooperate';

        return (
          <Button
            key={action}
            variant="outlined"
            className={props.classes.button}
            disabled={props.disableButtons}
            onClick={() => {
              props.dataFn.objInsert(cooperate, [
                'rounds',
                (props.round - 1).toString(),
                props.id
              ]);
            }}
          >
            {action}
          </Button>
        );
      })}
    </div>
  );
};

const StyledButtons = withStyles(styles)(ButtonsController);
const Buttons: ActivityRunnerT = (props: ButtonsPropsT) => (
  <StyledButtons {...props} />
);

export default Buttons;
