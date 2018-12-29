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

type StyledPropsT = ActivityRunnerPropsT & { classes: Object };

class PrisonerDilemmaController extends React.Component<StyledPropsT> {

  constructor(props) {
    super(props);

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

    const round = Object.keys(this.props.data['rounds']).length;

    const disableButtons =
      students.indexOf(this.props.userInfo.id) < 0 ||
      this.props.userInfo.id in this.props.data.rounds[(round - 1).toString()];

    const waiting = students.indexOf(this.props.userInfo.id) > -1 && disableButtons ? (
      <div className={this.props.classes.waiting}>
          {' '}
          Waiting for the other player...{' '}
      </div>
    ) : (
      <div />
    );

    return (
      <div>
        <Scoreboard
          data={this.props.data}
          dataFn={this.props.dataFn}
          config={this.props.activityData.config}
          students={students}
          round={round}
        />

        {
            this.props.data.phase !== 2 ? (
                <div>
                    <div className={this.props.classes.imageContainer}>
                        <img
                            id='players_image'
                            alt=''
                            className={this.props.classes.image}
                            src='/clientFiles/ac-prisoner-dilemma/idle.png'
                        />
                    </div>

                  <hr />

                  <Buttons
                    id={this.props.userInfo.id}
                    dataFn={this.props.dataFn}
                    disableButtons={disableButtons}
                    round={round}
                  />
                  {waiting}
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
