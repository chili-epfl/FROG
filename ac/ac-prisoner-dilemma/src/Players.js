import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

// Styles

const styles = {
    imageContainer: {
        width: '100%',
        height: '30%',
    },
    image: {
        display: 'inline-block',
        marginLeft: '15%',
        marginRight: '15%',
        width: '70%',
    }
};

// Props types

type PlayersPropsT = { students: Array, round: number, roundsLog: Object };
type StyledPlayersPropsT = PlayersPropsT & { classes: Object };

// Component

const PlayersController = (props: StyledPlayersPropsT) => {

    return (
        <div className={props.classes.imageContainer}>
            <img
                id='players_image'
                alt=''
                className={props.classes.image}
                src='/clientFiles/ac-prisoner-dilemma/idle.png' //TODO verify it works
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
