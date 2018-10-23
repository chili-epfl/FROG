// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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

        // TODO: evaluate whether to remove this check or not
        if(!this.props.data.length || this.props.data.length < 3) {
            this.props.dataFn.objInsert({
                    name: this.props.userInfo.name,
                    score: 0
                },
                this.props.userInfo.id
            );

            this.props.dataFn.objInsert(
                {0: {}},
                'rounds'
            );
        }
    }

    renderScoreboard(students) {

        return students.map(key => (
            <span
                id={key}
                className={this.props.classes.score}
            >
                {this.props.data[key].name} : {this.props.data[key].score} pts
            </span>
        ));
    }

    underlineUpdate(id, oldScore, newScore) {
        const color = (newScore === oldScore) ? yellow :
            (newScore > oldScore ? green : red);

        let root = document.getElementById(id);
        root.style.background = color;
        setTimeout(() => {
            root.style.background = '#fafafa';
        }, 750);
    }

    computeScore(id, player, adversary) {
        const scores = this.props.activityData.config.gainMatrix;

        let oldScore = this.props.data[id].score;
        let newScore = oldScore;
        newScore += player ?
            (adversary ? scores.cooperateCooperate : scores.cooperateCheat) :
            (adversary ? scores.cheatCooperate : scores.cheatCheat);

        this.underlineUpdate(id, oldScore, newScore);

        this.props.dataFn.objInsert(
            newScore,
            [id, 'score']
        );
    }

    updateScore(round) {
        const keys = Object.keys(this.props.data.rounds[(round - 1).toString()]);
        if (keys.length === 2) {

            const a = this.props.data.rounds[(round - 1).toString()][keys[0]];
            const b = this.props.data.rounds[(round - 1).toString()][keys[1]];

            this.computeScore(keys[0], a, b);
            this.computeScore(keys[1], b, a);

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

    clickHandler(r, cooperate) {
        this.props.dataFn.objInsert(
            cooperate,
            ['rounds', (r - 1).toString(), this.props.userInfo.id]
        );
    };

    renderActionButton(label, enabled, round, cooperate) {
        return (
            <Button
                variant="outlined"
                className={this.props.classes.button}
                disabled={enabled}
                onClick={() => this.clickHandler(round, cooperate)}
            >
                {label}
            </Button>
        );
    }

    render() {

        const students = Object.keys(this.props.data)
            .filter(k => k !== 'rounds')
            .sort()
            .splice(0, 2);

        if (!('rounds' in this.props.data) || students.length < 2) {
            return (<div> Charging ... </div>);
        }

        const round = Object.keys(this.props.data['rounds']).length;

        const disableButtons = students.indexOf(this.props.userInfo.id) < 0 ||
            this.props.userInfo.id in this.props.data.rounds[(round - 1).toString()];

        this.updateScore(round);

        return (
            <div id="root">
                <div className={this.props.classes.scoreBoard}>
                    {this.renderScoreboard(students)}
                </div>

                {this.renderPlayers(students, round)}

                <hr/>

                <div className={this.props.classes.buttonContainer}>
                    {this.renderActionButton('Cooperate', disableButtons, round, true)}
                    {this.renderActionButton('Cheat', disableButtons, round, false)}
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
