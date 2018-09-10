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
        label={choice}
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
          label={choice}
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
      placeholder="Justify your answer"
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
      dataFn.objInsert({ text: '' }, ['form', questionIndex]);
      return <CircularProgress />;
    }

    const { multiple, text } = question;

    const answersWithIndex = question.answers.map((x, y) => [x, y]);
    const answers = ['answers', 'both'].includes(activityData.config.shuffle)
      ? condShuffle(answersWithIndex, 'answers', index, groupingValue)
      : answersWithIndex;

    const hasChoices = question.answers && question.answers.length > 0;
    const questionData = data.form[questionIndex] || {};

    const onChange = idx => {
      if (multiple) {
        dataFn.objInsert(!questionData[idx], ['form', questionIndex, idx]);
      } else {
        dataFn.objInsert({ [idx]: true, text: questionData.text }, [
          'form',
          questionIndex
        ]);
      }
      // const numAnswers =
      //   Object.keys(data.form).length +
      //   (data.form[questionIndex] !== undefined ? 0 : 1);
      // const numQuestions = activityData.config.questions.length;

      // logger([
      //   { type: 'progress', value: numAnswers / (numQuestions + 0.1) },
      //   { type: 'score', value: numAnswers },
      //   { type: 'choice', itemId: questionIndex, value: e.formData - 1 }
      // ]);
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
              logger={logger}
              dataFn={dataFn}
              questionIndex={questionIndex}
            />
          )}
      </div>
    );
  }
);
