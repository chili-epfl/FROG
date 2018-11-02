import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';


// Colors

const baseColor = '#fafafa';
const red = '#e07059';
const yellow = '#eded1e';
const green = '#8bc34a';

// Actions
const baseAction = '';
const cooperate = 'Cooperate';
const cheat = 'Cheat';
const actionPostfix = '_action';

// Styles

const styles = {
    scoreBoard: {
        marginBottom: '25px',
        marginTop: '25px',
        width: '100%',
        height: '150px',
    },
    score: {
        display: 'inline-block',
        fontSize: '30px',
        width: '20%',
        marginLeft: '15%',
        marginRight: '15%',
        textAlign: 'center',
        borderRadius: '10px',
        lineHeight: '50px',
    }
};

// Props types

type ScoreboardPropsT = { data: Object, dataFn: Object, config: Object, students: Array, round: number };
type StyledScoreboardPropsT = ScoreboardPropsT & { classes: Object };

// Component

const ScoreboardController = (props: StyledScoreboardPropsT) =>  {

    // Methods

    const renderScoreboard = () => props.students.map(key => (
        <span
            id={key}
            className={props.classes.score}
        >
            {props.data.students[key].name} : {props.data.students[key].score} pts
        </span>
    ));

    const renderActions = () => props.students.map(key => (
        <span
            id={key + actionPostfix}
            className={props.classes.score}
        />
    ));

    const underlineScore = (id, oldScore, newScore) => {
        const color = (newScore === oldScore) ? yellow :
            (newScore > oldScore ? green : red);

        const element = document.getElementById(id);
        element.style.background = color;
        setTimeout(() => {
            element.style.background = baseColor;
        }, 750);
    };

    const showAction = (id, action) => {
        const text = action ? cooperate : cheat;

        const element = document.getElementById(id + actionPostfix);
        element.innerHTML = text;
        setTimeout(() => {
            element.innerHTML = baseAction;
        }, 750);
    };

    const computeScore = (id, player, adversary) => {
        const scores = props.config.gainMatrix;

        const oldScore = props.data.students[id].score;
        let newScore = oldScore;
        newScore += player ?
            (adversary ? scores.cooperateCooperate : scores.cooperateCheat) :
            (adversary ? scores.cheatCooperate : scores.cheatCheat);

        underlineScore(id, oldScore, newScore);
        showAction(id, player);

        props.dataFn.objInsert(
            newScore,
            ["students", id, 'score']
        );
    };

    const updateScore = () => {
        const keys = Object.keys(props.data.rounds[(props.round - 1).toString()]);
        if (keys.length === 2) {

            const a = props.data.rounds[(props.round - 1).toString()][keys[0]];
            const b = props.data.rounds[(props.round - 1).toString()][keys[1]];

            computeScore(keys[0], a, b);
            computeScore(keys[1], b, a);

            const path = props.config.rounds === props.round ?
                'winner' : ['rounds', props.round.toString()];

            props.dataFn.objInsert(
                {},
                path
            );
        }
    };

    // Rendering

    if (!props.data.winner) {
        updateScore();
    }

    return (
        <div  className={props.classes.scoreBoard}>
            <div>
                {renderScoreboard()}
            </div>
            <div>
                {renderActions()}
            </div>
        </div>
    );
};

// Export

const StyledScoreboard = withStyles(styles)(ScoreboardController);
const Scoreboard: ActivityRunnerT = (props: ScoreboardPropsT) => (
    <StyledScoreboard {...props} />
);

export default Scoreboard;
