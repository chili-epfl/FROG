import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const styles = {
    buttonContainer: {
        marginBottom: '50px',
        marginTop: '50px',
        marginLeft: '25%',
        marginRight: '25%',
        width: '50%',
    },
    button: {
        fontSize: '20px',
        height: '45px',
        marginLeft: '2%',
        marginRight: '2%',
        textAlign: 'center',
        width: '46%',
    }
};

type ButtonsPropsT = { id: string, dataFn: Object, disableButtons: boolean, round: number};
type StyledButtonsPropsT = ButtonsPropsT & { classes: Object };

const ButtonsController = (props: StyledButtonsPropsT) => {

    const clickHandler = (round, cooperate) => {
        props.dataFn.objInsert(
            cooperate,
            ['rounds', (round - 1).toString(), props.id]
        );
    };

    const renderActionButton = (label, disabled, round, cooperate) => {
        return (
            <Button
                variant="outlined"
                className={props.classes.button}
                disabled={disabled}
                onClick={() => clickHandler(round, cooperate)}
            >
                {label}
            </Button>
        );
    };

    return (
        <div className={props.classes.buttonContainer}>
            {renderActionButton('Cooperate', props.disableButtons, props.round, true)}
            {renderActionButton('Cheat', props.disableButtons, props.round, false)}
        </div>
    );
};

const StyledButtons = withStyles(styles)(ButtonsController);
const Buttons: ActivityRunnerT = (props: ButtonsPropsT) => (
    <StyledButtons {...props} />
);

export default Buttons;