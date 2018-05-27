// @flow

import * as React from 'react';
import Button from '@material-ui/core/Button';
import Form from 'react-jsonschema-form';
import { type LearningItemT, ReactiveText } from 'frog-utils';

const ThumbViewer = ({ LearningItem, data }) => (
  <React.Fragment>
    <b>{data.group}</b>
    <br />
    {data.attachments.map(x => (
      <LearningItem key={JSON.stringify(x)} id={x} type="thumbView" />
    ))}
  </React.Fragment>
);

const Viewer = ({ LearningItem, data }) => (
  <React.Fragment>
    <h3>{data.group}</h3>
    <br />
    {data.attachments.length === 1 ? (
      <LearningItem id={data.attachments[0]} type="view" />
    ) : (
      data.attachments.map(x => (
        <LearningItem
          clickZoomable
          key={JSON.stringify(x)}
          id={x}
          type="thumbView"
        />
      ))
    )}
  </React.Fragment>
);

const Editor = ({ data, dataFn, LearningItem }) => (
  <React.Fragment>
    <div className="bootstrap">
      <b>Group name:</b>
      <ReactiveText type="textinput" path="group" dataFn={dataFn} />
    </div>
    <p>Click on an attachment to delete it</p>
    {data.attachments.map((x, i) => (
      <span
        key={JSON.stringify(x)}
        onClick={() =>
          // eslint-disable-next-line no-alert
          window.confirm('Do you really want to delete this attachment?') &&
          dataFn.listDel(x, ['attachments', i])
        }
      >
        <dataFn.LearningItem id={x} type="thumbView" />
      </span>
    ))}
    <LearningItem
      type="create"
      liType="li-image"
      onCreate={e => dataFn.listAppend(e, 'attachments')}
    />
  </React.Fragment>
);

class Creator extends React.Component<
  *,
  { formData: string, attachments: any[] }
> {
  state = { formData: '', attachments: [] };

  render() {
    const { LearningItem, createLearningItem } = this.props;
    const complete =
      this.state.formData.length > 0 && this.state.attachments.length > 0;
    return (
      <>
        <div className="bootstrap" style={{ width: '500px' }}>
          <Form
            schema={{ title: 'Group title', type: 'string' }}
            formData={this.state.formData}
            onChange={e => this.setState({ formData: e.formData })}
          >
            {' '}
          </Form>
        </div>
        {this.state.attachments.map((x, i) => (
          <span
            key={JSON.stringify(x)}
            onClick={() =>
              // eslint-disable-next-line no-alert
              window.confirm('Do you really want to delete this attachment?') &&
              this.setState({
                attachments: this.state.attachments.splice(i, 1)
              })
            }
          >
            <LearningItem id={x} type="thumbView" />
          </span>
        ))}
        <LearningItem
          type="create"
          liType="li-image"
          onCreate={e =>
            this.setState({ attachments: [...this.state.attachments, e] })
          }
        />
        <Button
          onClick={() =>
            createLearningItem('li-cs211', {
              group: this.state.formData,
              attachments: this.state.attachments
            })
          }
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
