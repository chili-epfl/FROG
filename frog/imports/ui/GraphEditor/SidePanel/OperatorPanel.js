// @flow
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { ChangeableText } from 'frog-utils';
import type { operatorPackageT } from 'frog-utils';

import { Operators, addOperator } from '/imports/api/activities';
import { operatorTypes, operatorTypesObj } from '/imports/operatorTypes';
import { connect } from '../store';
import ListComponent from './ListComponent';

class ChooseOperatorTypeComp extends Component {
  state: { expanded: ?string, searchStr: string };

  constructor(props) {
    super(props);
    this.state = { expanded: null, searchStr: '' };
  }

  render() {
    const select = operatorType => {
      Operators.update(this.props.operator._id, {
        $set: { operatorType: operatorType.id }
      });
      this.props.store.addHistory();
    };

    const changeSearch = e =>
      this.setState({
        expanded: null,
        searchStr: e.target.value.toLowerCase()
      });

    const filteredList = operatorTypes.filter(
      x =>
        x.meta.name.toLowerCase().includes(this.state.searchStr) ||
        x.meta.shortDesc.toLowerCase().includes(this.state.searchStr) ||
        x.meta.description.toLowerCase().includes(this.state.searchStr)
    );

    return (
      <div style={{ height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h4>Please select operator type</h4>
          <div
            className="input-group"
            style={{ top: '5px', left: '10px', width: '250px' }}
          >
            <span className="input-group-addon" id="basic-addon1">
              <span className="glyphicon glyphicon-search" aria-hidden="true" />
            </span>
            <input
              type="text"
              onChange={changeSearch}
              className="form-control"
              placeholder="Search for..."
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div
          className="list-group"
          style={{ height: '730px', width: '100%', overflow: 'scroll' }}
        >
          {filteredList.length === 0
            ? <div
                style={{
                  marginTop: '20px',
                  marginLeft: '10px',
                  fontSize: '40px'
                }}
              >
                No result
              </div>
            : filteredList.map((x: operatorPackageT) =>
                <ListComponent
                  onSelect={() => select(x)}
                  showExpanded={this.state.expanded === x.id}
                  expand={() => this.setState({ expanded: x.id })}
                  key={x.id}
                  onPreview={() => {}}
                  object={x}
                  searchS={this.state.searchStr}
                  eventKey={x.id}
                />
              )}
        </div>
      </div>
    );
  }
}

const EditClass = ({ store: { operatorStore: { all } }, operator }) => {
  const graphOperator = all.find(act => act.id === operator._id);

  return (
    <div>
      <div style={{ backgroundColor: '#eee' }}>
        <h3>
          <ChangeableText
            value={graphOperator.title || ''}
            operatorId={operator._id}
            onChange={graphOperator.rename}
          />
        </h3>
        <font size={-3}>
          <i>
            {`Type: ${operatorTypesObj[operator.operatorType].meta.name}
                     (${operator.operatorType})`}
          </i>
        </font>
        <hr />
      </div>
      <Form
        schema={operatorTypesObj[operator.operatorType].config}
        onChange={data =>
          addOperator(
            operator.operatorType,
            data.formData,
            operator._id,
            data.errors.length > 0
          )}
        formData={operator.data}
        liveValidate
      >
        <div />
      </Form>
    </div>
  );
};

const EditOperator = connect(EditClass);
const ChooseOperatorType = connect(ChooseOperatorTypeComp);

export default createContainer(
  ({ id }) => ({ operator: Operators.findOne(id) }),
  ({ operator }) => {
    if (operator.operatorType && operator.operatorType !== '') {
      return <EditOperator operator={operator} />;
    } else {
      return <ChooseOperatorType operator={operator} />;
    }
  }
);
