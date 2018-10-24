import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

const red = '#e07059';
const yellow = '#eded1e';
const green = '#8bc34a';

const styles = {
    scoreBoard: {
        marginBottom: '50px',
        marginTop: '50px',
        width: '100%',
    },
    score: {
        display: 'inline-block',
        fontSize: '30px',
        width: '20%',
        marginLeft: '15%',
        marginRight: '15%',
        textAlign: 'center',
        borderRadius: '10px',
        lineHeight: '50px'
    }
};

type ScoreboardPropsT = { data: Object, dataFn: Object, config: Object, students: Array, round: number };
type StyledScoreboardPropsT = ScoreboardPropsT & { classes: Object };

const ScoreboardController = (props: StyledScoreboardPropsT) =>  {

    const renderScoreboard = () => {
        return props.students.map(key => (
            <span
                id={key}
                className={props.classes.score}
            >
                {props.data[key].name} : {props.data[key].score} pts
            </span>
        ));
    };

    const underlineUpdate = (id, oldScore, newScore) => {
        const color = (newScore === oldScore) ? yellow :
            (newScore > oldScore ? green : red);

        const element = document.getElementById(id);
        element.style.background = color;
        setTimeout(() => {
            element.style.background = '#fafafa';
        }, 750);
    };

    const computeScore = (id, player, adversary) => {
        const scores = props.config.gainMatrix;

        const oldScore = props.data[id].score;
        let newScore = oldScore;
        newScore += player ?
            (adversary ? scores.cooperateCooperate : scores.cooperateCheat) :
            (adversary ? scores.cheatCooperate : scores.cheatCheat);

        underlineUpdate(id, oldScore, newScore);

        props.dataFn.objInsert(
            newScore,
            [id, 'score']
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

    if (!props.data.winner) {
        updateScore();
    }

    return (
        <div className={props.classes.scoreBoard}>
            {renderScoreboard()}
        </div>
    );
};

const StyledScoreboard = withStyles(styles)(ScoreboardController);
const Scoreboard: ActivityRunnerT = (props: ScoreboardPropsT) => (
    <StyledScoreboard {...props} />
);

export default Scoreboard;