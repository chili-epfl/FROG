import * as React from 'react';
import { type ActivityRunnerT } from '/imports/frog-utils';
import { withStyles } from '@material-ui/core/styles';

const actionPostfix = '_action';

const styles = {
  scoreBoard: {
    width: '100%',
    height: '75px'
  },
  score: {
    display: 'inline-block',
    fontSize: '30px',
    width: '20%',
    marginLeft: '15%',
    marginRight: '15%',
    marginTop: '15px',
    textAlign: 'center',
    borderRadius: '10px',
    lineHeight: '50px'
  }
};

type ScoreboardPropsT = {
  data: Object,
  students: Array,
  lId: string,
  rId: string,
  lAction: string,
  rAction: string,
  lBackground: string,
  rBackground: string
};

type StyledScoreboardPropsT = ScoreboardPropsT & { classes: Object };

const ScoreboardController = (props: StyledScoreboardPropsT) => (
  <div className={props.classes.scoreBoard}>
    <div>
      <span
        id={props.lId}
        className={props.classes.score}
        style={{ background: props.lBackground }}
      >
        {props.data.students[props.lId].name} :{' '}
        {props.data.students[props.lId].score} pts
      </span>
      <span
        id={props.rId}
        className={props.classes.score}
        style={{ background: props.rBackground }}
      >
        {props.data.students[props.rId].name} :{' '}
        {props.data.students[props.rId].score} pts
      </span>
    </div>
    <div>
      <span id={props.lId + actionPostfix} className={props.classes.score}>
        {props.lAction}
      </span>
      <span id={props.rId + actionPostfix} className={props.classes.score}>
        {props.rAction}
      </span>
    </div>
  </div>
);

const StyledScoreboard = withStyles(styles)(ScoreboardController);
const Scoreboard: ActivityRunnerT = (props: ScoreboardPropsT) => (
  <StyledScoreboard {...props} />
);

export default Scoreboard;
