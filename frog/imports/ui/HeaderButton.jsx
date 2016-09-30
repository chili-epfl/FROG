import React, { Component } from 'react';
 
export default class HeaderButton extends Component {
  render() {
    return (
      <p className="select" onClick={this.props.data.onClick}>
        {this.props.data.id}
      </p>
    );
  }
}

