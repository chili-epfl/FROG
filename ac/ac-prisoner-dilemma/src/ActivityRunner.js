// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

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
    },
    imageContainer: {
        marginBottom: '75px',
        marginTop: '75px',
        width: '100%',
    },
    image: {
        display: 'inline-block',
        marginLeft: '15%',
        marginRight: '15%',
        width: '20%',
    },
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

const red = '#e07059';
const yellow = '#eded1e';
const green = '#8bc34a';

type StyledPropsT = ActivityRunnerPropsT & { classes: Object };
class PrisonerDilemmaController extends React.Component<StyledPropsT> {

    constructor(props) {
        super(props);

        this.props.dataFn.objInsert(
            {score: 0},
            this.props.userInfo.name
        );

        this.props.dataFn.objInsert(
            {0: {}},
            'rounds'
        );
    }

    renderScoreboard(students) {

        return students.map(key => (
            <span
                id={key}
                className={this.props.classes.score}
            >
                {key} : {this.props.data[key].score} pts
            </span>
        ));
    }

    computeScore(student, player, adversary) {
        const scores = this.props.activityData.config.gainMatrix;

        let oldScore = this.props.data[student].score;
        let newScore = oldScore;
        newScore += player ?
            (adversary ? scores.cooperateCooperate : scores.cooperateCheat) :
            (adversary ? scores.cheatCooperate : scores.cheatCheat);

        this.flashBackground(student, oldScore, newScore);

        this.props.dataFn.objInsert(
            {score: newScore},
            student
        );
    }

    updateScore(round) {
        const studentsKeys = Object.keys(this.props.data.rounds[(round - 1).toString()]);
        if (studentsKeys.length === 2) {

            const a = this.props.data.rounds[(round - 1).toString()][studentsKeys[0]];
            const b = this.props.data.rounds[(round - 1).toString()][studentsKeys[1]];

            this.computeScore(studentsKeys[0], a, b);
            this.computeScore(studentsKeys[1], b, a);

            this.props.dataFn.objInsert(
                {},
                ['rounds', round.toString()]
            );
        }
    }

    selectImage(player, adversary) {
        let imagePath = '/clientFiles/ac-prisoner-dilemma/';

        imagePath += player ?
            (adversary ? 'happy.png' : 'sad.png') :
            (adversary ? 'cheat.png' : 'zero.png');

        return imagePath;
    }

    renderPlayers(students, round) {
        if (round < 2) {
            return (
                <div className={this.props.classes.imageContainer}>
                    <img
                        className={this.props.classes.image}
                        src='/clientFiles/ac-prisoner-dilemma/happy.png'
                    />
                    <img
                        className={this.props.classes.image}
                        src='/clientFiles/ac-prisoner-dilemma/happy.png'
                    />
                </div>
            );
        }

        const a = this.props.data.rounds[(round - 2).toString()][students[0]];
        const b = this.props.data.rounds[(round - 2).toString()][students[1]];

        return (
            <div className={this.props.classes.imageContainer}>
                <img
                    className={this.props.classes.image}
                    src={this.selectImage(a, b)}
                />
                <img
                    className={this.props.classes.image}
                    src={this.selectImage(b, a)}
                />
            </div>
        );
    }

    flashBackground(student, oldScore, newScore) {
        const color = (newScore === oldScore) ? yellow :
            (newScore > oldScore ? green : red);

        let root = document.getElementById(student);
        root.style.background = color;
        setTimeout(() => {
            root.style.background = '#fafafa';
        }, 750);
    }

    clickHandler(r, cooperate) {
        this.props.dataFn.objInsert(
            cooperate,
            ['rounds', (r - 1).toString(), this.props.userInfo.name]
        );
    };

    renderActionButton(label, enabled, round, cooperate) {
        return (
            <button
                className={this.props.classes.button}
                disabled={enabled}
                onClick={() => this.clickHandler(round, cooperate)}
            >
                {label}
            </button>
        );
    }

    render() {

        if (!('rounds' in this.props.data)) {
            return (<div> Charging ... </div>);
        }

        const round = Object.keys(this.props.data['rounds']).length;
        const enableButtons = this.props.userInfo.name in this.props.data.rounds[(round - 1).toString()];

        const students = Object.keys(this.props.data).filter(k => k !== 'rounds');

        this.updateScore(round);

        return (
            <div id="root">
                <div className={this.props.classes.scoreBoard}>
                    {this.renderScoreboard(students)}
                </div>

                {this.renderPlayers(students, round)}

                <hr/>

                <div className={this.props.classes.buttonContainer}>
                    {this.renderActionButton('Cooperate', enableButtons, round, true)}
                    {this.renderActionButton('Cheat', enableButtons, round, false)}
                </div>
            </div>
        );
    }
}

const StyledPrisonerDilemma = withStyles(styles)(PrisonerDilemmaController);
const PrisonerDilemma: ActivityRunnerT = (props: ActivityRunnerPropsT) => (
  <StyledPrisonerDilemma {...props} />
);

export default PrisonerDilemma;
