import * as React from 'react';
import Form from 'react-jsonschema-form';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { type LearningItemT, ReactiveText } from 'frog-utils';

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

const schema = {
  type: 'object',
  properties: {
    topic: {
      type: 'string',
      title: 'What is the topic?'
    },
    content: {
      type: 'string',
      title: 'What is the difficulty you encountered?'
    }
  }
};

const Creator = withStyles(styles)(({ createLearningItem, classes }) => (
  <div className="bootstrap">
    <Form
      schema={schema}
      formData={{}}
      onSubmit={e => {
        if (e.formData && e.formData.topic && e.formData.content) {
          createLearningItem('li-cs411-learn-topic', {
            topic: e.formData.topic,
            content: e.formData.content
          });
        }
      }}
    >
      <Button className={classes.button} type="submit">
        Add Topic
      </Button>
    </Form>
  </div>
));

export default ({
  name: 'Learning Topic',
  id: 'li-cs411-learn-topic',
  dataStructure: { topic: '', content: '' },
  ThumbViewer,
  Viewer,
  Creator,
  Editor
}: LearningItemT<{ topic: string, content: string }>);
