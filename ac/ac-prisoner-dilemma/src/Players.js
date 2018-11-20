import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

// Styles

const styles = {
    imageContainer: {
        marginBottom: '50px',
        marginTop: '50px',
        width: '100%',
        height: '40%',
    },
    image: {
        display: 'inline-block',
        marginLeft: '15%',
        marginRight: '15%',
        width: '20%',
    }
};

// Props types

type PlayersPropsT = { students: Array, round: number, roundsLog: Object };
type StyledPlayersPropsT = PlayersPropsT & { classes: Object };

// Component

const PlayersController = (props: StyledPlayersPropsT) => {

    // Rendering

    const leftPlayer = props.round < 2 ? true : props.roundsLog[(props.round - 2).toString()][props.students[0]];
    const rightPlayer = props.round < 2 ? true : props.roundsLog[(props.round - 2).toString()][props.students[1]];

    return (
        <div className={props.classes.imageContainer}>
            <img
                id='players_image'
                alt=''
                className={props.classes.image}
                src='/clientFiles/ac-prisoner-dilemma/idle,png' //TODO verify it works
            />
        </div>
    );
};

// Export

const StyledPlayers = withStyles(styles)(PlayersController);
const Players: ActivityRunnerT = (props: PlayersPropsT) => (
    <StyledPlayers {...props} />
);

export default Players;
