// @flow

import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Mousetrap from 'mousetrap';

import TextField from '@material-ui/core/TextField';

import { type LearningItemT, ReactiveText } from 'frog-utils';

const ThumbViewer = ({ LearningItem, data }) => (
  <React.Fragment>
    <b>{data.group}</b>
    <br />
    <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
      {data.attachments.map(x => (
        <div style={{ flex: 1 }}>
          <LearningItem key={JSON.stringify(x)} id={x} type="thumbView" />
        </div>
      ))}
    </div>
  </React.Fragment>
);

class ZoomPic extends React.Component<*, *> {
  state = { localIndex: this.props.index };

  componentDidMount() {
    Mousetrap.bind('left', e => {
      e.preventDefault();
      this.setState({ localIndex: Math.max(this.state.localIndex - 1, 0) });
    });
    Mousetrap.bind('right', e => {
      e.preventDefault();
      this.setState({
        localIndex: Math.min(
          this.state.localIndex + 1,
          this.props.attachments.length - 1
        )
      });
    });
    Mousetrap.bind('esc', e => {
      e.preventDefault();
      this.props.onClose();
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind(['right', 'left', 'esc']);
  }

  render() {
    const { LearningItem } = this.props;
    return (
      <Dialog
        maxWidth={false}
        open
        onClose={() => {
          this.setState({ index: false });
        }}
      >
        <LearningItem
          id={this.props.attachments[this.state.localIndex]}
          type="view"
        />
      </Dialog>
    );
  }
}

class Viewer extends React.Component<*, *> {
  state = { index: null };
  render() {
    const { LearningItem, data } = this.props;
    return (
      <div>
        <h3>{data.group}</h3>
        <br />
        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
          {data.attachments.map((x, i) => (
            <div
              key={JSON.stringify(x)}
              onClick={() => this.setState({ index: i })}
              style={{ flex: 1 }}
            >
              <LearningItem
                id={x}
                type={data.attachments.length === 1 ? 'view' : 'thumbView'}
              />
            </div>
          ))}
        </div>
        {this.state.index !== null && (
          <ZoomPic
            index={this.state.index}
            LearningItem={LearningItem}
            attachments={data.attachments}
            onClose={() => this.setState({ index: null })}
          />
        )}
      </div>
    );
  }
}

const Editor = ({ data, dataFn, LearningItem }) => (
  <React.Fragment>
    <div className="bootstrap">
      <b>Group name:</b>
      <ReactiveText type="textinput" path="group" dataFn={dataFn} />
    </div>
    <p>Click on an attachment to delete it</p>
    <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
      {data.attachments.map((x, i) => (
        <div
          style={{ flex: 1 }}
          key={JSON.stringify(x)}
          onClick={() =>
            // eslint-disable-next-line no-alert
            window.confirm('Do you really want to delete this attachment?') &&
            dataFn.listDel(x, ['attachments', i])
          }
        >
          <dataFn.LearningItem id={x} type="thumbView" />
        </div>
      ))}
    </div>
    <LearningItem
      type="create"
      liType="li-image"
      onCreate={e => dataFn.listAppend(e, 'attachments')}
    />
  </React.Fragment>
);

class Creator extends React.Component<
  *,
  { group: string, attachments: any[] }
> {
  state = { group: '', attachments: [] };

  render() {
    const { LearningItem, createLearningItem } = this.props;
    const complete =
      this.state.group.length > 0 && this.state.attachments.length > 0;
    return (
      <>
        <TextField
          id="name"
          label="Group Name"
          value={this.state.group}
          onChange={e => this.setState({ group: e.target.value })}
          margin="normal"
          fullWidth
        />
        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
          {this.state.attachments.map((x, i) => (
            <div
              style={{ flex: 1 }}
              key={JSON.stringify(x)}
              onClick={() => {
                if (
                  // eslint-disable-next-line no-alert
                  window.confirm(
                    'Do you really want to delete this attachment?'
                  )
                ) {
                  const newAttach = [...this.state.attachments];
                  newAttach.splice(i, 1);
                  this.setState({
                    attachments: newAttach
                  });
                }
              }}
            >
              <LearningItem id={x} type="thumbView" />
            </div>
          ))}
        </div>
        <LearningItem
          type="create"
          liType="li-image"
          onCreate={e =>
            this.setState({ attachments: [...this.state.attachments, e] })
          }
        />
        <Button
          onClick={() => createLearningItem('li-cs211', this.state)}
          color="primary"
          variant="raised"
          aria-label="submit"
          disabled={!complete}
        >
          Submit
        </Button>
      </>
    );
  }
}

export default ({
  name: 'CS211 competition entry',
  id: 'li-cs211',
  ThumbViewer,
  Viewer,
  Creator,
  Editor,
  dataStructure: { group: '', attachments: [] }
}: LearningItemT<{ group: string, attachments: any[] }>);
