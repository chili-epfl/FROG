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
    <h1>Thumbnail</h1>
    <b>{data.title}</b>
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
    <b>Title:</b>
    <ReactiveText path="title" dataFn={dataFn} />
    <b>Content:</b>
    <ReactiveText path="content" type="textarea" dataFn={dataFn} />
  </div>
));

const schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Idea'
    },
    content: {
      type: 'string',
      title: 'Text'
    }
  }
};

const Creator = withStyles(styles)(({ createLearningItem, classes }) => (
  <div className="bootstrap">
    <Form
      schema={schema}
      formData={{}}
      onSubmit={e => {
        if (e.formData && e.formData.title && e.formData.content) {
          createLearningItem('li-idea', {
            title: e.formData.title,
            content: e.formData.content
          });
        }
      }}
    >
      <Button className={classes.button} type="submit" id="addButton">
        Add idea
      </Button>
    </Form>
  </div>
));

export default ({
  name: 'Idea',
  id: 'li-idea',
  dataStructure: { title: '', content: '' },
  ThumbViewer,
  Creator,
  Editor
}: LearningItemT<{ title: string, content: string }>);
