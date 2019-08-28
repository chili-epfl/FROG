import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Card from './Card';
import styles from './styles';

const POSITIVE_EXAMPLES = [];
const NEGATIVE_EXAMPLES = [];

POSITIVE_EXAMPLES[1] = [
  [2, 0, 1],
  [0, 0, 0],
  [1, 1, 1],
  [1, 2, 0],
  [28, 28, 28],
  [54, 55, 56],
  [56, 27, 1],
  [29, 56, 2],
  [54, 54, 54],
  [55, 2, 27]
];

NEGATIVE_EXAMPLES[1] = [
  [2, 1, 1],
  [0, 0, 2],
  [0, 1, 0],
  [1, 1, 2],
  [28, 1, 28],
  [0, 55, 56],
  [29, 27, 1],
  [29, 56, 29],
  [0, 54, 56],
  [29, 28, 2]
];

POSITIVE_EXAMPLES[2] = [
  [1, 0, 2],
  [27, 0, 54],
  [56, 28, 0],
  [56, 56, 56],
  [1, 28, 55],
  [27, 28, 29],
  [1, 56, 27],
  [29, 29, 29],
  [28, 55, 1],
  [55, 56, 54]
];

NEGATIVE_EXAMPLES[2] = [
  [1, 0, 29],
  [27, 1, 54],
  [29, 28, 0],
  [56, 29, 56],
  [1, 28, 1],
  [29, 28, 29],
  [1, 55, 27],
  [29, 29, 2],
  [27, 55, 56],
  [54, 56, 54]
];

const Intro = withStyles(styles)(({ start, classes }) => (
  <div className={classes.introContainer}>
    <h2>Inductive Learning</h2>
    <p>
      You will be shown several triplets of cards (similar to the two triplets
      below). There is a rule that you must discover by yourself that separates
      between correct and incorrect triplets.
    </p>
    <div className={classes.exampleListsContainer}>
      <Example cards={[0, 1, 2]} styleName={classes.exampleInIntro} />
      <Example cards={[27, 27, 0]} styleName={classes.exampleInIntro} />
    </div>
    <Button color="primary" onClick={start}>
      Got it!
    </Button>
  </div>
));

const Example = withStyles(styles)(({ cards, classes, styleName }) => (
  <Paper className={styleName || classes.example}>
    {cards.map((card, idx) => (
      <Card
        key={idx.toString()}
        value={card}
        style={{
          height: '94%',
          margin: '2%',
          flex: '1 1 0px',
          border: 'solid black 1px'
        }}
      />
    ))}
  </Paper>
));

const ExampleList = withStyles(styles)(({ examples, positive, classes }) => {
  const n = examples.length;
  return (
    <div
      className={classes.list}
      style={{
        backgroundColor: positive ? '#dfd' : '#fdd',
        marginRight: positive ? 4 : 0,
        marginLeft: positive ? 0 : 4
      }}
    >
      {positive && (
        <h2 className={classes.listTitle}>Correct triplets ( {n} / 10 )</h2>
      )}
      {!positive && (
        <h2 className={classes.listTitle}>Incorrect triplets ( {n} / 10 )</h2>
      )}
      <div className={classes.examplesList}>
        {examples.map((ex, i) => (
          <Example cards={ex} key={i.toString()} />
        ))}
      </div>
    </div>
  );
});

const BottomBox = withStyles(styles)(
  ({ correct, handleClick, setRule, rule, step, classes }) => {
    if (step === 10) {
      return (
        <div className={classes.bottom}>
          <TextField
            label="Your rule"
            multiline
            style={{ width: '100%' }}
            InputProps={{ classes: { root: classes.nocursor } }}
            variant="outlined"
            margin="dense"
            value={rule}
            rowsMax={5}
          />
          <h2>Activity Completed!</h2>
        </div>
      );
    } else if (!correct) {
      return (
        <div className={classes.bottom}>
          <span>
            Find a rule that distinguishes between the correct and incorrect
            examples
          </span>
          <TextField
            label="Rule"
            multiline
            style={{ width: '100%' }}
            defaultValue={rule}
            variant="outlined"
            margin="dense"
            rowsMax={5}
            onChange={e => setRule(e.target.value)}
          />
          <Button
            disabled={!rule}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => handleClick(true)}
          >
            Submit
          </Button>
        </div>
      );
    } else {
      return (
        <div className={classes.bottom}>
          <TextField
            label="Your rule"
            multiline
            style={{ width: '100%' }}
            InputProps={{ classes: { root: classes.nocursor } }}
            variant="outlined"
            margin="dense"
            value={rule}
            rowsMax={5}
          />
          <span>
            Look at the new examples and make sure that your rule classifies
            positively all
            <b> correct examples </b>
            and negatively all
            <b> incorrect examples </b>.
          </span>
          <br />
          <span>Is your rule correct?</span>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => handleClick(true)}
            color="primary"
          >
            Yes, my rule is correct!
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => handleClick(false)}
            color="primary"
          >
            No, my rule is incorrect
          </Button>
        </div>
      );
    }
  }
);

class Learn extends React.Component {
  state = {
    rule: '',
    correct: false
  };

  componentDidMount = () => {
    if (!this.props.data.randomSeed) {
      const randomSeed = Math.ceil(2 * Math.random());
      this.props.dataFn.objInsert({ randomSeed, step: 0 });
    }
  };

  handleClick = correct => {
    const { dataFn, data, logger } = this.props;
    const { rule } = this.state;
    const newStep = correct ? data.step + 1 : data.step;
    logger([
      { type: 'answer', payload: { rule, step: data.step, correct } },
      { type: 'progress', value: newStep / 10 }
    ]);
    dataFn.objInsert(newStep, 'step');
    this.setState({ correct });
  };

  render() {
    const { classes, data, dataFn } = this.props;
    const { rule, correct } = this.state;
    const { step, randomSeed } = data;
    if (!step || step < 1) {
      return (
        <div className={classes.main}>
          <Intro start={() => dataFn.objInsert(1, 'step')} />
        </div>
      );
    }
    return (
      <div className={classes.main}>
        <div className={classes.exampleListsContainer}>
          <ExampleList
            examples={POSITIVE_EXAMPLES[randomSeed].slice(0, step)}
            positive
          />
          <ExampleList
            examples={NEGATIVE_EXAMPLES[randomSeed].slice(0, step)}
          />
        </div>
        <div className={classes.bottomContainer}>
          <BottomBox
            rule={rule}
            correct={correct}
            handleClick={this.handleClick}
            setRule={r => this.setState({ rule: r })}
            step={step}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Learn);
