// @flow

import React from 'react';
import FlexView from 'react-flexview';
import { FormControl } from 'react-bootstrap';

import { connect } from '../../store';

const operations = {
  number: ['==', '>', '>=', '<', '<=', '...range...'],
  string: ['contains', 'does not contain']
};

class Condition extends React.Component<*, *> {
  state = { selected: undefined, operation: '', condition: '' };

  render() {
    const {
      formContext: { nodeId, nodeType },
      store
    } = this.props;

    const nodeStore = (nodeType === 'activity'
      ? store.activityStore
      : store.operatorStore
    ).all.find(x => x.id === nodeId);
    const definition = nodeStore?.incoming?.[0]?.outputDefinition;
    if (!definition) {
      return <p>No connected activities with output definitions</p>;
    }

    return (
      <>
        <FlexView>
          <FormControl
            onChange={e => this.setState({ selected: e.target.value })}
            componentClass="select"
            style={{ width: '240px', marginRight: '20px' }}
            value={this.state.selected}
          >
            {['', ...Object.keys(definition)].map(x => (
              <option value={x} key={x}>
                {x === '' ? 'Choose an attribute' : definition[x].title}
              </option>
            ))}
          </FormControl>
          {this.state.selected &&
            this.state.selected !== '' && (
              <>
                <FormControl
                  style={{ width: '100px', marginRight: '20px' }}
                  onChange={e => this.setState({ operation: e.target.value })}
                  componentClass="select"
                  value={this.state.operation}
                >
                  {operations[definition[this.state.selected].type].map(x => (
                    <option value={x} key={x}>
                      {x}
                    </option>
                  ))}
                </FormControl>
                <FormControl
                  style={{ width: '100px' }}
                  onChange={e => this.setState({ condition: e.target.value })}
                  componentClass="input"
                  value={this.state.condition}
                />
              </>
            )}
        </FlexView>
      </>
    );
  }
}

export default connect(Condition);
