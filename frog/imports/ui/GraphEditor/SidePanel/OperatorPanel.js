// @flow
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import FlexView from 'react-flexview';
import {
  type operatorPackageT,
  ChangeableText,
  EnhancedForm
} from 'frog-utils';

import { Operators, addOperator } from '/imports/api/activities';
import { operatorTypes, operatorTypesObj } from '/imports/operatorTypes';
import { ErrorList, ValidButton } from '../Validator';
import { connect } from '../store';
import { SelectFormWidget } from './ActivityPanel/SelectWidget';
import addSocialFormSchema from './ActivityPanel/addSocialSchema';
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

    const filteredList = operatorTypes
      .filter(
        x =>
          x.meta.name.toLowerCase().includes(this.state.searchStr) ||
          x.meta.shortDesc.toLowerCase().includes(this.state.searchStr) ||
          x.meta.description.toLowerCase().includes(this.state.searchStr)
      )
      .sort((x: Object, y: Object) => (x.meta.name < y.meta.name ? -1 : 1));

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          transform: 'translateY(-40px)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '95%',
            height: '35px'
          }}
        >
          <h4>Please select operator type</h4>
          <div
            className="input-group"
            style={{ top: '5px', left: '10px', width: '240px' }}
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
          style={{
            height: '93%',
            width: '100%',
            overflow: 'scroll',
            transform: 'translateY(10px)'
          }}
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

const EditClass = ({
  store: { graphErrors, refreshValidate, valid, operatorStore: { all } },
  operator
}) => {
  const graphOperator = all.find(act => act.id === operator._id);

  let errorColor;
  const errors = graphErrors.filter(x => x.id === operator._id);
  const error = errors.filter(x => x.severity === 'error');
  const warning = errors.filter(x => x.severity === 'warning');
  if (error.length > 0) {
    errorColor = 'red';
  } else if (warning.length > 0) {
    errorColor = 'yellow';
  } else {
    errorColor = 'green';
  }

  const operatorType = operatorTypesObj[operator.operatorType];

  return (
    <div style={{ height: '100%', overflowY: 'scroll', position: 'relative' }}>
      <div style={{ backgroundColor: '#eee' }}>
        <div style={{ position: 'absolute', left: -40 }}>
          <ErrorList activityId={operator._id} />
        </div>
        <FlexView>
          <div>
            <h3>
              <ChangeableText
                value={graphOperator.title || ''}
                operatorId={operator._id}
                onChange={graphOperator.rename}
              />
            </h3>
          </div>
          <FlexView marginLeft="auto">
            <ValidButton activityId={operator._id} errorColor={errorColor} />
          </FlexView>
        </FlexView>
        <font size={-3}>
          <i>
            {`Type: ${operatorType.meta.name}
                     (${operator.operatorType})`}
          </i>
        </font>
        <hr />
      </div>
      {operatorType.config &&
        operatorType.config.properties &&
        operatorType.config.properties !== {} &&
        <EnhancedForm
          {...addSocialFormSchema(operatorType.config, operatorType.configUI)}
          widgets={{ socialAttributeWidget: SelectFormWidget }}
          formContext={{ options: valid.social[operator._id] || [] }}
          onChange={data => {
            addOperator(
              operator.operatorType,
              data.formData,
              operator._id,
              data.errors.length > 0
            );
            refreshValidate();
          }}
          formData={operator.data}
        >
          <div />
        </EnhancedForm>}
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
