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

    // Methods

    const selectImage = (player, adversary) => {
        let imagePath = '/clientFiles/ac-prisoner-dilemma/';

        imagePath += player ?
            (adversary ? 'happy.png' : 'sad.png') :
            (adversary ? 'cheat.png' : 'zero.png');

        return imagePath;
    };

    // Rendering

    const leftPlayer = props.round < 2 ? true : props.roundsLog[(props.round - 2).toString()][props.students[0]];
    const rightPlayer = props.round < 2 ? true : props.roundsLog[(props.round - 2).toString()][props.students[1]];

    const imageLeft = selectImage(leftPlayer, rightPlayer);
    const imageRight = selectImage(rightPlayer, leftPlayer);

    return (
        <div className={props.classes.imageContainer}>
            <img
                alt=''
                className={props.classes.image}
                src={imageLeft}
            />
            <img
                alt=''
                className={props.classes.image}
                src={imageRight}
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
