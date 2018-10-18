import * as React from 'react';
import {
  type LearningItemT,
  ReactiveRichText
} from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  button: {
    float: 'right'
  }
});

export const FlexViewer = withStyles(styles)(({ dataFn }) => (
    <div>
      <ReactiveRichText
        path="text"
        readOnly
        dataFn={dataFn}
      />
    </div>
  )
);

export const Editor = withStyles(styles)(({ dataFn, classes, large }) => (
    <div className={classes.editorContainer}>
      <ReactiveRichText
        style={large ? { height: '600px' } : {}}
        path="text"
        dataFn={dataFn}
        readOnly={false}
      />
    </div>
  )
);

export default ({
  name: 'Rich text',
  id: 'li-richText',
  dataStructure: { text: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor
}: LearningItemT<{ title: string, content: string }>);
