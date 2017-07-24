// @flow
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { ChangeableText } from 'frog-utils';

import { Operators, addOperator } from '/imports/api/activities';
import { operatorTypes, operatorTypesObj } from '/imports/operatorTypes';
import { connect } from '../store';
import ListComponent from './ListComponent';

class ChooseOperatorTypeComp extends Component {
  state: { expanded: number, listObj: Array<any> };

  constructor(props) {
    super(props);
    this.state = { expanded: null, listObj: operatorTypes };
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
        listObj: operatorTypes.filter(x =>
          x.meta.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      });

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
          {this.state.listObj.map(x =>
            <ListComponent
              onSelect={() => select(x)}
              showExpanded={this.state.expanded === x.id}
              expand={() => this.setState({ expanded: x.id })}
              onPreview={() => {}}
              key={x.id}
              object={x}
              eventKey={x.id}
            />
          )}
        </div>
      </div>
    );
  }
}

//
// const ChooseOperatorTypeComp = withState(
//   'expanded',
//   'setExpand',
//   null
// )(({ operator, store: { addHistory }, expanded, setExpand }) => {
//   const select = operatorType => {
//     Operators.update(operator._id, {
//       $set: { operatorType: operatorType.id }
//     });
//     addHistory();
//   };
//   return (
//     <div style={{ height: '100%' }}>
//       <h4>Please select operator type</h4>
//       <div
//         className="list-group"
//         style={{ height: '730px', width: '100%', overflow: 'scroll' }}
//       >
//         {operatorTypes.map(x =>
//           <ListComponent
//             onSelect={() => select(x)}
//             showExpanded={expanded === x.id}
//             expand={() => setExpand(x.id)}
//             onPreview={() => {}}
//             key={x.id}
//             object={x}
//             eventKey={x.id}
//           />
//         )}
//       </div>
//     </div>
//   );
// });

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
