import * as React from 'react';
import Form from 'react-jsonschema-form';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import {
  type LearningItemT,
  ReactiveText,
  TextInput
} from '/imports/frog-utils';

const styles = () => ({
  button: {
    float: 'right'
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const ThumbViewer = ({ data }) => (
  <div>
    <b>{data.topic}</b>
    <br />
  </div>
);

const Viewer = ({ data }) => (
  <div>
    <b>{data.topic}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))}
  </div>
);

const Editor = withStyles(styles)(({ dataFn, classes }) => (
  <div className={classes.editorContainer}>
    <span>Choose a skill or topic that was difficult for you to learn.</span>
    <b>What is the topic?</b>
    <ReactiveText path="topic" dataFn={dataFn} />
    <b>What is the difficulty you encountered?</b>
    <ReactiveText path="content" type="textarea" dataFn={dataFn} />
  </div>
));

const Creator = withStyles(styles)(({ createLearningItem }) => {
  const [content, setContent] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('');

  const onSubmit = () => {
    if (content.length > 0 && difficulty.length > 0) {
      createLearningItem('li-cs411-learn-topic', {
        topic: content,
        content: difficulty
      });
    }
  };
  return (
    <div style={{ padding: '5px' }}>
      <div style={{ display: 'flex' }}>
        <p style={{ marginRight: '10px' }}>What is the topic?</p>
        <TextInput noBlur value={content} onChange={e => setContent(e)} focus />
      </div>
      <div style={{ display: 'flex' }}>
        <p style={{ marginRight: '10px' }}>Why was it difficult?</p>
        <TextInput
          noBlur
          value={difficulty}
          onChange={e => setDifficulty(e)}
          onSubmit={onSubmit}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          style={{ marginTop: '10px' }}
          variant="contained"
          color="primary"
          onClick={onSubmit}
        >
          Add
        </Button>
      </div>
    </div>
  );
});

export default ({
  name: 'Learning Topic',
  id: 'li-cs411-learn-topic',
  dataStructure: { topic: '', content: '' },
  ThumbViewer,
  Viewer,
  Creator,
  Editor
}: LearningItemT<{ topic: string, content: string }>);
