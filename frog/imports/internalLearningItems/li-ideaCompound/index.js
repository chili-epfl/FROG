// @flow

import * as React from 'react';
import { type LearningItemT, ReactiveText, uuid } from 'frog-utils';
import { isEqual } from 'lodash';
import { Paper, withStyles } from '@material-ui/core';
import Masonry from 'react-masonry-component';

const styles = {
  paper: {
    margin: '15px',
    minWidth: '30vw',
    maxWidth: '30vw',
    maxHeight: '70vh'
  }
};

const ThumbViewer = ({ LearningItem, data, classes }) => (
  <React.Fragment>
    <b>{data.title}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))}
    <Masonry>
      {data.attachments.map(x => (
        <Paper className={classes.paper} key={x.id || x}>
          <LearningItem id={x} type="thumbView" />
        </Paper>
      ))}
    </Masonry>
  </React.Fragment>
);

const Viewer = ({ LearningItem, data, classes }) => (
  <React.Fragment>
    <b>{data.title}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))}
    {data.attachments.length === 1 ? (
      <LearningItem id={data.attachments[0]} type="view" />
    ) : (
      <Masonry>
        {data.attachments.map(x => (
          <Paper className={classes.paper} key={x.id || x}>
            <LearningItem clickZoomable id={x} type="thumbView" />
          </Paper>
        ))}
      </Masonry>
    )}
  </React.Fragment>
);
const Edit = ({ dataFn }) => (
  <div className="bootstrap" style={{ width: '70%' }}>
    <b>Title:</b>
    <br />
    <ReactiveText type="textinput" path="title" dataFn={dataFn} />
    <br />
    <br />
    <b>Content:</b>
    <br />
    <ReactiveText path="content" type="textarea" dataFn={dataFn} />
  </div>
);

class Editor extends React.Component<*, *> {
  id: string;
  constructor(props) {
    super(props);
    this.id = uuid();
  }
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.data.attachments, this.props.data.attachments);
  }
  render() {
    const { data, dataFn, LearningItem } = this.props;
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', right: '0px' }}>
          <LearningItem
            type="create"
            onCreate={e => dataFn.listAppend(e, 'attachments')}
          />
        </div>
        <Edit key={this.id} dataFn={dataFn} />
        <Masonry>
          {data.attachments.map((x, i) => (
            <Paper
              className={this.props.classes.paper}
              key={x.id || x}
              onClick={() => dataFn.listDel(x, ['attachments', i])}
            >
              <dataFn.LearningItem id={x} type="thumbView" />
            </Paper>
          ))}
        </Masonry>
      </React.Fragment>
    );
  }
}

export default ({
  name: 'Idea with attachments',
  id: 'li-ideaCompound',
  ThumbViewer: withStyles(styles)(ThumbViewer),
  Viewer: withStyles(styles)(Viewer),
  Editor: withStyles(styles)(Editor),
  dataStructure: { title: '', content: '', attachments: [] }
}: LearningItemT<{ title: string, content: string, attachments: any[] }>);
