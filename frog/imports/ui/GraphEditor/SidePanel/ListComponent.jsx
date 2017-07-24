// @flow

import React, { Component } from 'react';
import { Activities, Operators } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';
import { operatorTypesObj } from '/imports/operatorTypes';

class ListComponent extends Component {
  state: { longDesc: boolean };
  constructor(props: any) {
    super(props);
    this.state = {
      longDesc: false
    };
  }

  render() {
    const obj = this.props.object;

    const click = () => this.setState({ longDesc: !this.state.longDesc });
    const select = () => {
      if (this.props.nodeType === 'activity') {
        if (activityTypesObj[obj.id]) {
          Activities.update(this.props.current._id, {
            $set: { activityType: obj.id }
          });
          this.props.addH();
        }
      } else if (operatorTypesObj[obj.id]) {
        Operators.update(this.props.current._id, {
          $set: { operatorType: obj.id }
        });
        this.props.addH();
      }
    };

    return (
      <div className="list-group-item">
        <h5 style={{ fontWeight: 'bold' }}>
          {obj.meta.name}
        </h5>
        <button
          type="button"
          className="btn btn-primary"
          value={obj.id}
          style={{
            position: 'absolute',
            right: '2px',
            top: '4px',
            width: '15%',
            height: '32px',
            textAlign: 'left'
          }}
          onClick={select}
        >
          Choose
        </button>
        <button
          type="button"
          className="btn btn-primary"
          style={{
            position: 'absolute',
            right: '2px',
            top: '38px',
            width: '15%',
            height: '32px'
          }}
          onClick={click}
        >
          <span
            className={
              this.state.longDesc
                ? 'glyphicon glyphicon-minus'
                : 'glyphicon glyphicon-plus'
            }
          >
            {' '}
          </span>
        </button>
        {!this.state.longDesc &&
          <div style={{ width: '85%' }}>
            {obj.meta.shortDesc}{' '}
          </div>}
        {this.state.longDesc &&
          <div style={{ width: '85%' }}>
            {obj.meta.description}{' '}
          </div>}
      </div>
    );
  }
}

export default ListComponent;
