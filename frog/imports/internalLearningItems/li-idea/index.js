import * as React from 'react';
import { ReactiveText } from 'frog-utils';
import Form from 'react-jsonschema-form';
import { withState } from 'recompose';
import Button from 'material-ui/Button';
import { type learningItemTypeT } from 'frog-utils';

const ThumbViewer = ({ data }) => (
  <React.Fragment>
    <b>{data.title}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
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
    <ReactiveText
      path="title"
      dataFn={dataFn}
      style={{ width: '80%', height: '100%', fontSize: '20px' }}
    />
    <br />
    <br />
    <b>Content:</b>
    <br />
    <ReactiveText
      path="content"
      type="textarea"
      dataFn={dataFn}
      style={{ width: '80%', height: '100%', fontSize: '20px' }}
    />
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
  ({ formdata, setFormdata, onCreate, createLearningItem }) => (
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
            const lid = createLearningItem('li-idea', {
              title: e.formData.title,
              content: e.formData.content
            });
            onCreate(lid);
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
}: learningItemTypeT);
