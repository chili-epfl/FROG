// @flow

import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Uploads,addUpload } from '../../../api/uploads';

const FileForm = ({ onChange }) => {
  return (<Form
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
  </Form>);
}

class fileUploader extends Component {
  state: { url: string, display: boolean };

  constructor(props: {}) {
    super(props);
    this.state = { url: '', display: false };
  }

  onChange = (e: { formData: { file: string } }) => {
    this.setState({url: 'Uploading …'});
    const that = this;
    let urlTmp = '';//addUpload(window.location.origin, e.formData.file);
    //this.setState({url: urlTmp});
    Promise.resolve(urlTmp = Uploads.insert(e.formData.file, (err, fileObj) => that.setState({url: window.location.origin + '/cfs/files/uploads/' + fileObj._id}))).then(this.setState({url: urlTmp}));
  };



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
              <CopyToClipboard
                text={this.state.url}
                style={{ height: '39px' }}
              >
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
