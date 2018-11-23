import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

const baseColor = '#fafafa';
const red = '#e07059';
const yellow = '#eded1e';
const green = '#8bc34a';

const baseAction = '';
const cooperate = 'Cooperate';
const cheat = 'Cheat';
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
  data: Object
};
type StyledScoreboardPropsT = ScoreboardPropsT & { classes: Object };

const renderScoreboard = props =>
  props.students.map(key => (
    <span id={key} className={props.classes.score}>
      {props.data.students[key].name} : {props.data.students[key].score} pts
    </span>
  ));

const renderActions = props =>
  props.students.map(key => (
    <span id={key + actionPostfix} className={props.classes.score} />
  ));

const underlineScore = (id, oldScore, newScore) => {
  const color =
    newScore === oldScore ? yellow : newScore > oldScore ? green : red;

  const element = document.getElementById(id);
  element.style.background = color;
  setTimeout(() => {
    element.style.background = baseColor;
  }, 1500);
};

const showAction = (id, action) => {
  const text = action ? cooperate : cheat;

  const element = document.getElementById(id + actionPostfix);
  element.innerHTML = text;
  setTimeout(() => {
    element.innerHTML = baseAction;
  }, 1500);
};

const computeScore = (props, id, player, adversary) => {
  const oldScore = props.data.students[id].score;
  let newScore = oldScore;
  newScore += player ? (adversary ? 2 : -1) : adversary ? 3 : 0;

  underlineScore(id, oldScore, newScore);
  showAction(id, player);

  props.dataFn.objInsert(newScore, ['students', id, 'score']);
};

const updateScore = props => {
  const keys = Object.keys(props.data.rounds[(props.round - 1).toString()]);
  if (keys.length === 2) {
    const a = props.data.rounds[(props.round - 1).toString()][keys[0]];
    const b = props.data.rounds[(props.round - 1).toString()][keys[1]];

    computeScore(props, keys[0], a, b);
    computeScore(props, keys[1], b, a);
    updateImage(a, b);

    if (props.config.rounds !== props.round) {
      props.dataFn.objInsert({}, ['rounds', props.round.toString()]);
    } else {
      // No more rounds but wait to show winner
      props.dataFn.objInsert(1, 'phase');

      setTimeout(() => {
        // Show winner
        props.dataFn.objInsert(2, 'phase');
      }, 1500);
    }
  }
};

const updateImage = (left, right) => {
  const basePath = '/clientFiles/ac-prisoner-dilemma/';

  const imagePath = left
    ? right
      ? 'win_win.png'
      : 'lose_win.png'
    : right
      ? 'win_lose.png'
      : 'lose_lose.png';

  const element = document.getElementById('players_image');
  element.src = basePath + imagePath;
  setTimeout(() => {
    element.src = basePath + 'idle.png';
  }, 1500);
};
const ScoreboardController = (props: StyledScoreboardPropsT) => {
  if (props.data.phase === 0) {
    updateScore(props);
  }

  return (
    <div className={props.classes.scoreBoard}>
      <div>{renderScoreboard(props)}</div>
      <div>{renderActions(props)}</div>
    </div>
  );
};

// Export

const StyledScoreboard = withStyles(styles)(ScoreboardController);
const Scoreboard: ActivityRunnerT = (props: ScoreboardPropsT) => (
  <StyledScoreboard {...props} />
);

export default Scoreboard;
