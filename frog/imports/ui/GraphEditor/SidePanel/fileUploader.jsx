// @flow

import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Uploads } from '../../../api/uploads';

const FileForm = ({ onChange }) =>
  <Form
    schema={{
      type: 'object',
      properties: {
        file: {
          type: 'string',
          title: 'Upload an image to get its URI'
        }
      }
    }}
    uiSchema={{
      file: {
        'ui:widget': 'file'
      }
    }}
    onChange={onChange}
    liveValidate
  >
    <div />
  </Form>;

class fileUploader extends Component {
  state: { url: string, display: boolean };
  mounted: boolean;

  constructor(props: {}) {
    super(props);
    this.state = { url: '', display: false };
  }

  onChange = (e: { formData: { file: string } }) => {
    if (this.mounted) {
      this.setState({ url: 'Uploading …' });
      const that = this;
      window.setTimeout(
        () =>
          Uploads.insert(e.formData.file, (err, fileObj) => {
            that.setState({
              url: window.location.origin + '/cfs/files/uploads/' + fileObj._id
            });
          }),
        1
      );
    }
  };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <div>
        <div style={{ width: '100%', height: '2px', background: 'black' }} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h4 style={{ textDecoration: 'underline' }}>
            {' '}File to URL converting tool :{' '}
          </h4>
          <button
            style={{ marginLeft: '20px' }}
            onClick={() => this.setState({ display: !this.state.display })}
          >
            {this.state.display ? 'Close' : 'Open'}
          </button>
        </div>
        {this.state.display &&
          <div>
            <FileForm onChange={this.onChange} />
            <h4>{'Submitted file as data URL'}</h4>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <CopyToClipboard text={this.state.url} style={{ height: '39px' }}>
                <button>Copy</button>
              </CopyToClipboard>
              <pre style={{ width: '100%' }}>
                {' ' + this.state.url.toString()}
              </pre>
            </div>
          </div>}
      </div>
    );
  }
}

export default fileUploader;
