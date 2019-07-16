// @flow
import * as React from 'react';
import Form from 'react-jsonschema-form';
import { FormControl } from 'react-bootstrap';
import { listWikis, listPages } from '/imports/client/Wiki/helpers';

const SelectWiki = ({ formContext, onChange, value = '' }: any) => (
  <span>
    {formContext && formContext.names ? (
      <FormControl
        onChange={e => onChange(e.target.value)}
        componentClass="select"
        value={value}
      >
        {['', ...formContext.names].map(x => (
          <option value={x || ''} key={x || 'choose'}>
            {x === '' ? 'Select a wiki' : x}
          </option>
        ))}
      </FormControl>
    ) : (
      <span style={{ color: 'red' }}>No wikis available</span>
    )}
  </span>
);

const SelectPage = ({ formContext, onChange, value = '' }: any) => (
  <span>
    {formContext && formContext.pages ? (
      <FormControl
        onChange={e => onChange(e.target.value)}
        componentClass="select"
        value={value}
      >
        {['', ...formContext.pages].map(x => (
          <option value={x || ''} key={x || 'choose'}>
            {x === '' ? 'Select wiki page' : x}
          </option>
        ))}
      </FormControl>
    ) : (
      <span style={{ color: 'red' }}>No pages available</span>
    )}
  </span>
);

type PropsT = {
  configData: Object,
  setConfigData: Object => void,
  formContext: Object
};

class ConfigComponent extends React.Component<
  PropsT,
  { formData: Object, wikis?: string[], pages?: string[] }
> {
  constructor(props: PropsT) {
    super(props);
    this.state = { formData: this.props.configData };
    listWikis().then(e => this.setState({ wikis: e }));
    if (this.state.formData?.component?.wiki) {
      listPages(this.state.formData.component.wiki).then(e =>
        this.setState({ pages: e })
      );
    }
  }

  render() {
    return (
      <div style={{ marginTop: '20px' }} className="bootstrap">
        <Form
          formData={this.state.formData.component}
          onChange={e => {
            if (e.formData.wiki !== this.state.formData.component.wiki) {
              this.setState({ pages: [] }, () => {
                listPages(e.formData.wiki).then(pages =>
                  this.setState({ pages })
                );
              });
              this.props.setConfigData({ ...e.formData, page: '' });
            } else {
              this.props.setConfigData({ ...e.formData });
            }
            const formData = e.formData;
            this.setState({
              formData: { ...this.state.formData, component: formData }
            });
          }}
          schema={{
            type: 'object',
            properties: {
              wiki: { type: 'string', title: 'Wiki' },
              page: {
                title: 'Page',
                type: 'string'
              }
            }
          }}
          uiSchema={{
            wiki: { 'ui:widget': SelectWiki },
            page: { 'ui:widget': SelectPage }
          }}
          formContext={{
            names: this.state.wikis,
            pages: (this.state.pages || []).map(x => x[0])
          }}
        >
          &nbsp;
        </Form>
      </div>
    );
  }
}

export default ConfigComponent;
