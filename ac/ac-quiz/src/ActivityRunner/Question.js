// @flow

import React from 'react';
import { HTML, ReactiveText } from 'frog-utils';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

import { condShuffle } from './Quiz';
import { computeProgress, computeCoordinates } from '../utils';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '4px'
  },
  formControl: {
    margin: theme.spacing.unit
  },
  header: {
    backgroundColor: '#ddd',
    borderBottom: '2px solid black',
    padding: '4px',
    marginBottom: '4px'
  },
  justify: {
    width: '100%',
    padding: '4px',
    height: '100px'
  },
  check: { height: '35px', alignItems: 'flex-start' },
  text: { lineHeight: '1', alignItems: 'flex-start' }
});

const Header = withStyles(styles)(({ question, index, classes }) => (
  <div className={classes.header}>
    <b>Question {index + 1}:</b>
    <HTML html={question} />
  </div>
));

const CheckBox = withStyles(styles)(({ classes, answers, data, onChange }) => (
  <FormControl component="fieldset" className={classes.formControl}>
    {answers.map(([{ choice }, idx]) => (
      <FormControlLabel
        key={idx}
        classes={{ root: classes.text }}
        control={
          <Checkbox
            classes={{ root: classes.check }}
            checked={!!data[idx]}
            onChange={() => onChange(idx)}
            value={idx.toString()}
          />
        }
        label={<HTML className={classes.text} html={choice} />}
      />
    ))}
  </FormControl>
));

const Select = withStyles(styles)(({ classes, answers, data, onChange }) => (
  <FormControl component="fieldset" className={classes.formControl}>
    <RadioGroup
      aria-label="answers"
      value={Object.keys(data).find(k => data[k] === true)}
      name="answers"
      onChange={e => onChange(e.target.value)}
    >
      {answers.map(([{ choice }, idx]) => (
        <FormControlLabel
          key={idx}
          value={idx.toString()}
          classes={{ root: classes.text }}
          control={<Radio classes={{ root: classes.check }} />}
          label={<HTML className={classes.text} html={choice} />}
        />
      ))}
    </RadioGroup>
  </FormControl>
));

const Justify = withStyles(styles)(props => {
  const { logger, dataFn, questionIndex, classes } = props;
  return (
    <ReactiveText
      type="textarea"
      path={['form', questionIndex, 'text']}
      logger={logger}
      dataFn={dataFn}
      className={classes.justify}
    />
  );
});

const Value = withStyles(styles)(props => {
  const { value, dataFn, questionIndex, classes } = props;
  return (
    <TextField
      label="Answer with a numerical value"
      value={value}
      onChange={e =>
        dataFn.objInsert(e.target.value, ['form', questionIndex, 'value'])
      }
      className={classes.textField}
      type="number"
      margin="normal"
      variant="outlined"
    />
  );
});

export default withStyles(styles)(
  ({
    question,
    questionIndex,
    index,
    data,
    dataFn,
    logger,
    groupingValue,
    activityData,
    classes
  }: Object) => {
    if (!data.form[questionIndex]) {
      return <CircularProgress />;
    }

    const { multiple, text, value } = question;

    const answersWithIndex = (question.answers || []).map((x, y) => [x, y]);
    const answers = ['answers', 'both'].includes(activityData.config.shuffle)
      ? condShuffle(answersWithIndex, 'answers', index, groupingValue)
      : answersWithIndex;

    const hasChoices = answers && answers.length > 0;
    const questionData = data.form[questionIndex] || {
      text: '',
      value: undefined
    };

    const onChange = idx => {
      if (multiple) {
        dataFn.objInsert(!questionData[idx], ['form', questionIndex, idx]);
      } else {
        dataFn.objInsert({ [idx]: true, text: questionData.text }, [
          'form',
          questionIndex
        ]);
      }

      const prevQuestion = (multiple && data.form[questionIndex]) || {};
      const newQuestion = { ...prevQuestion, [idx]: !prevQuestion[idx] };
      const newForm = { ...data.form, [questionIndex]: newQuestion };
      const configQuestions = activityData.config.questions;

      const newProgress = computeProgress(configQuestions, newForm);
      const newCoordinates = computeCoordinates(configQuestions, newForm);

      logger([
        { type: 'progress', value: newProgress },
        { type: 'score', value: newProgress },
        { type: 'choice', itemId: questionIndex, value: idx },
        { type: 'coordinates', payload: newCoordinates }
      ]);
    };

    const logProgressAndLog = x => {
      const progress = computeProgress(
        activityData.config.questions,
        data.form
      );
      logger([x, { type: 'progress', value: progress }]);
    };

    return (
      <div className={classes.root}>
        <Header question={question.question} index={index} />
        {hasChoices &&
          multiple && (
            <CheckBox
              answers={answers}
              data={questionData}
              onChange={onChange}
            />
          )}
        {hasChoices &&
          !multiple && (
            <Select answers={answers} data={questionData} onChange={onChange} />
          )}
        {value && (
          <Value
            value={questionData.value}
            dataFn={dataFn}
            questionIndex={questionIndex}
          />
        )}
        {text &&
          questionData.text !== undefined && (
            <Justify
              logger={logProgressAndLog}
              dataFn={dataFn}
              questionIndex={questionIndex}
            />
          )}
      </div>
    );
  }
);
