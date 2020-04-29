import * as React from 'react';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import {
  type LearningItemT,
  TextInput,
  ReactiveText,
  HighlightSearchText
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
  <div style={{ fontSize: '2em', minWidth: '200px' }}>
    <b>
      <HighlightSearchText haystack={data.topic} needle={search} />
    </b>
  </div>
);

const Editor = withStyles(styles)(({ dataFn, classes }) => (
  <div className={classes.editorContainer}>
    <ReactiveText path="topic" dataFn={dataFn} />
  </div>
));

const Creator = withStyles(styles)(({ createLearningItem }) => {
  const [content, setContent] = React.useState('');
  const onSubmit = () => {
    if (content.trim().length > 0) {
      createLearningItem('li-short', { topic: content.trim() });
      setContent('');
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ fontSize: '1.5em' }}>
        <TextInput
          noBlur
          value={content}
          onChange={e => setContent(e)}
          onSubmit={onSubmit}
          focus
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
  name: 'Single Word/Sentence',
  id: 'li-short',
  dataStructure: { topic: '' },
  ThumbViewer,
  Editor,
  Creator,
  search: (data, search) => data.topic.toLowerCase().includes(search)
}: LearningItemT<{ topic: string, content: string }>);
