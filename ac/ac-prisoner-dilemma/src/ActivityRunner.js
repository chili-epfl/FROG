// @flow

import * as React from 'react';
import { type ActivityRunnerT, type ActivityRunnerPropsT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

import Scoreboard from './Scoreboard';
import Buttons from './Buttons';

const styles = {
  result: {
    marginTop: '50px',
    fontSize: '50px',
    lineHeight: '45px',
    textAlign: 'center',
    width: '100%'
  },
  waiting: {
    textAlign: 'center',
    width: '100%'
  },
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

const cooperate = 'Cooperate';
const cheat = 'Cheat';
const baseColor = '#fafafa';
const red = '#e07059';
const yellow = '#eded1e';
const green = '#8bc34a';
const basePath = '/clientFiles/ac-prisoner-dilemma/';

type StyledPropsT = ActivityRunnerPropsT & { classes: Object };

class PrisonerDilemmaController extends React.Component<StyledPropsT, any> {

  constructor(props) {
    super(props);

    this.state = {
        action: ['', ''],
        background: [baseColor, baseColor],
        imagePath: 'idle.png'
    };

    this.props.dataFn.objInsert(
      {
        name: this.props.userInfo.name,
        score: 0
      },
      ['students', this.props.userInfo.id]
    );
  }

  render() {
    const students = Object.keys(this.props.data.students)
      .sort()
      .splice(0, 2);

    if (!('rounds' in this.props.data) || students.length < 2) {
      return (
        <div className={this.props.classes.waiting}>
          {' '}
          Waiting for the other player...{' '}
        </div>
      );
    }

    const currentRound = Object.keys(this.props.data['rounds']).length;

    const disableButtons =
        students.indexOf(this.props.userInfo.id) < 0 ||
        this.props.userInfo.id in this.props.data.rounds[(currentRound - 1).toString()];

    const keys = Object.keys(this.props.data.rounds[(currentRound - 1).toString()]).sort();

    if (this.props.data.phase === 0 && keys.length === 2) {
        const left = this.props.data.rounds[(currentRound - 1).toString()][keys[0]];
        const right = this.props.data.rounds[(currentRound - 1).toString()][keys[1]];

        const points = left ?
            (right ? [2, 2] : [-1, 3]) :
            (right ? [3, -1] : [0, 0]);

        [0, 1].map(i => {
            this.props.dataFn.objInsert(
                this.props.data.students[students[i]].score + points[i],
                ["students", students[i], 'score']
            );
        });

        if (left) {
            if (right) {
                this.setState({
                    action: [cooperate, cooperate],
                    background: [green, green],
                    imagePath: 'win_win.png'
                });
            } else {
                this.setState({
                    action: [cooperate, cheat],
                    background: [red, green],
                    imagePath: 'lose_win.png'
                });
            }
        } else {
            if (right) {
                this.setState({
                    action: [cheat, cooperate],
                    background: [green, red],
                    imagePath: 'win_lose.png'
                    });
            } else {
                this.setState({
                    action: [cheat, cheat],
                    background: [yellow, yellow],
                    imagePath: 'lose_lose.png'
                });
            }
        }

        setTimeout(() => {
            this.setState({
                action: ['', ''],
                background: [baseColor, baseColor],
                imagePath: 'idle.png'
            });
        }, 1500);

        if (this.props.activityData.config.rounds !== currentRound) {
            this.props.dataFn.objInsert(
                {},
                ['rounds', currentRound.toString()]
            );
        } else {
            this.props.dataFn.objInsert(1, 'phase');

            setTimeout(() => {
                this.props.dataFn.objInsert(2, 'phase');
            }, 1500);
        }
    }

    return (
        <div>
            <Scoreboard
                data={this.props.data}
                dataFn={this.props.dataFn}
                config={this.props.activityData.config}
                students={students}
                round={currentRound}
                lId={students[0]}
                rId={students[1]}
                lAction={this.state.action[0]}
                rAction={this.state.action[1]}
                lBackground={this.state.background[0]}
                rBackground={this.state.background[1]}
            />

            {
                this.props.data.phase !== 2 ? (
                    <div>
                        <div className={this.props.classes.imageContainer}>
                            <img
                                id='players_image'
                                alt=''
                                className={this.props.classes.image}
                                src={basePath + this.state.imagePath}
                            />
                        </div>

                        <hr />

                        <Buttons
                            id={this.props.userInfo.id}
                            dataFn={this.props.dataFn}
                            disableButtons={disableButtons}
                            round={currentRound}
                        />
                        {
                            students.indexOf(this.props.userInfo.id) > -1 && disableButtons ?
                                (<div className={this.props.classes.waiting}>
                                    {' '}Waiting for the other player...{' '}
                                </div>) :
                                (<div />)
                        }
                    </div>
                ) : (
                    <div className={this.props.classes.result}>
                        {
                            this.props.data.students[students[0]].score === this.props.data.students[students[1]].score ?
                                'Tie!' :
                                this.props.data.students[students[0]].score > this.props.data.students[students[1]].score ?
                                    this.props.data.students[students[0]].name + ' won!' :
                                    this.props.data.students[students[1]].name + ' won!'
                        }
                    </div>
                )
            }
        </div>
    );
    }
}

const StyledPrisonerDilemma = withStyles(styles)(PrisonerDilemmaController);
const PrisonerDilemma: ActivityRunnerT = (props: ActivityRunnerPropsT) => (
  <StyledPrisonerDilemma {...props} />
);

export default PrisonerDilemma;
