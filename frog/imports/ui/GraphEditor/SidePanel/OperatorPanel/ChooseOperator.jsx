// @flow

import React, { Component } from 'react';

import type { operatorPackageT, OperatorDbT } from 'frog-utils';
import { Graphs } from '/imports/api/graphs';
import { operatorTypes } from '/imports/operatorTypes';
import { type StoreProp } from '../../store';
import ListComponent from '../ListComponent';

type PropsT = StoreProp & {
  operator: OperatorDbT
};

type StateT = { expanded: ?string, searchStr: string };

export default class ChooseOperatorTypeComp extends Component<PropsT, StateT> {
  constructor(props: PropsT) {
    super(props);
    this.state = { expanded: null, searchStr: '' };
  }

  render() {
    const select = operatorType => {
      const ops = Graphs.findOne({ _id: this.props.graphId }).operators;
      const op = ops.find(x => x.id === this.props.operator._id);
      op.operatorType = operatorType.id;
      Graphs.update(
        { _id: this.props.graphId },
        {
          $set: {
            operators: [...ops.filter(x => x.id !== operatorType.id), op]
          }
        }
      );
      this.props.store.addHistory();
    };

    const changeSearch = e =>
      this.setState({
        expanded: null,
        searchStr: e.target.value.toLowerCase()
      });

    const filteredList = operatorTypes
      .filter(x => x.type === this.props.operator.type)
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
          {filteredList.length === 0 ? (
            <div
              style={{
                marginTop: '20px',
                marginLeft: '10px',
                fontSize: '40px'
              }}
            >
              No result
            </div>
          ) : (
            filteredList.map((x: operatorPackageT) => (
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
            ))
          )}
        </div>
      </div>
    );
  }
}
