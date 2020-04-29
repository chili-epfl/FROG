import * as React from 'react';
import Form from 'react-jsonschema-form';

import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

import {
  type LearningItemT,
  HighlightSearchText,
  ReactiveText
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

const ThumbViewer = ({ data, search }) => (
  <div>
    <b>
      <HighlightSearchText haystack={data.title} needle={search} />
    </b>
    <br />
    {data.content.split('\n').map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        <HighlightSearchText haystack={line} needle={search} />
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
      <Button
        variant="contained"
        className={classes.button}
        type="submit"
        id="addButton"
      >
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
  Editor,
  search: (data, search) =>
    data.title.toLowerCase().includes(search) ||
    data.content.toLowerCase().includes(search)
}: LearningItemT<{ title: string, content: string }>);
