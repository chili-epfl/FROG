import * as React from 'react';
import Form from 'react-jsonschema-form';
import { withState } from 'recompose';
import Button from 'material-ui/Button';
import { type LearningItemT, ReactiveText } from 'frog-utils';

const ThumbViewer = ({ data }) => (
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
  </React.Fragment>
);

const Editor = ({ dataFn }) => (
  <div className="bootstrap">
    <b>Title:</b>
    <br />
    <ReactiveText path="title" dataFn={dataFn} />
    <br />
    <b>Content:</b>
    <br />
    <ReactiveText path="content" type="textarea" dataFn={dataFn} />
  </div>
);

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

const Creator = withState('formdata', 'setFormdata', {})(
  ({ formdata, setFormdata, createLearningItem }) => (
    <div className="bootstrap">
      <hr
        style={{
          boxShadow: 'inset 0 12px 12px -12px rgba(0, 0, 0, 0.5)',
          height: '12px'
        }}
      />
      <Form
        schema={schema}
        formData={formdata}
        onSubmit={e => {
          if (e.formData && e.formData.title && e.formData.content) {
            createLearningItem('li-idea', {
              title: e.formData.title,
              content: e.formData.content
            });
            setFormdata({});
          }
        }}
      >
        <div
          style={{
            layout: 'flex',
            flexDirection: 'row',
            width: '100%'
          }}
        >
          <Button style={{ marginRight: '20px' }} type="submit" id="addButton">
            Add idea
          </Button>
        </div>
      </Form>
      <div style={{ width: '500px' }} />
    </div>
  )
);

export default ({
  name: 'Idea',
  id: 'li-idea',
  dataStructure: { title: '', content: '' },
  ThumbViewer,
  Creator,
  Editor
}: LearningItemT<{ title: string, content: string }>);
