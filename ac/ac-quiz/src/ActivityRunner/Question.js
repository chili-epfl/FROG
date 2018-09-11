// @flow

import React from 'react';
import { HTML, ReactiveText } from 'frog-utils';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

import { condShuffle } from './Quiz';
import { computeProgress, isAnswered } from '../utils';

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
  }
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
        control={
          <Checkbox
            checked={!!data[idx]}
            onChange={() => onChange(idx)}
            value={idx.toString()}
          />
        }
        label={<HTML html={choice} />}
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
          control={<Radio />}
          label={<HTML html={choice} />}
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

    const { multiple, text } = question;

    const answersWithIndex = (question.answers || []).map((x, y) => [x, y]);
    const answers = ['answers', 'both'].includes(activityData.config.shuffle)
      ? condShuffle(answersWithIndex, 'answers', index, groupingValue)
      : answersWithIndex;

    const hasChoices = answers && answers.length > 0;
    const questionData = data.form[questionIndex] || { text: '' };

    const onChange = idx => {
      if (multiple) {
        dataFn.objInsert(!questionData[idx], ['form', questionIndex, idx]);
      } else {
        dataFn.objInsert({ [idx]: true, text: questionData.text }, [
          'form',
          questionIndex
        ]);
      }

      const nQuestions = activityData.config.questions.length;
      const includeCurrentQuestion =
        isAnswered(questionData, question) && (!text || questionData.text)
          ? 0
          : 1;
      const newProgress =
        computeProgress(activityData.config.questions, data.form) +
        includeCurrentQuestion / nQuestions;

      logger([
        { type: 'progress', value: newProgress },
        { type: 'score', value: newProgress },
        { type: 'choice', itemId: questionIndex, value: idx }
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
