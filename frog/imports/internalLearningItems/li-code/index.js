import * as React from 'react';
import { type LearningItemT, isBrowser } from 'frog-utils';
import ShareDBCodeMirror from './sharedb-codemirror-binding';

import { UnControlled as CodeMirror } from 'react-codemirror2';

if (isBrowser) {
  require('./codemirrorcss.js');
  require('codemirror/mode/python/python');
}

const FlexViewer = ({ data, dataFn, search, type }) => {
  const [cm, setCM] = React.useState(undefined);

  return (
    <div>
      <CodeMirror
        value=""
        editorDidMount={editor => {
          const ed = new ShareDBCodeMirror(editor, dataFn.doc, [
            'payload',
            'code'
          ]);
          ed.start();
          setCM(ed);
        }}
        options={{
          theme: 'material',
          mode: 'python',
          tabSize: 2,
          lineNumbers: true,
          verbose: true
        }}
      />
    </div>
  );
};

// const Editor = withStyles(styles)(({ dataFn, classes, large }) => (
//   <div className={classes.editorContainer}>
//     <ReactiveText
//       style={large ? { height: '600px' } : {}}
//       path="text"
//       dataFn={dataFn}
//       type="textarea"
//       rows={large && 20}
//     />
//   </div>
// ));

export default ({
  name: 'Code',
  id: 'li-code',
  dataStructure: { code: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor: FlexViewer,
  search: (data, search) => data.text.toLowerCase().includes(search)
}: LearningItemT<{ title: string, content: string }>);
