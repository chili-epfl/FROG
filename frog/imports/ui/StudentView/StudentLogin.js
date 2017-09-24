// @flow
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Spinner from 'react-spinner';
import { Link } from 'react-router-dom';

const splitList = (list: string[]) => {
  const extra = list.length % 2 ? 1 : 0;
  const length = list.length / 2;
  return [list.slice(0, length + extra), list.slice(length + extra)];
};

class StudentLogin extends Component {
  state: { studentlist?: string[] };

  componentWillMount() {
    Meteor.call('frog.studentlist', this.props.slug, (err, result) =>
      this.setState({ studentlist: result })
    );
  }

  render() {
    if (!this.state || !this.state.studentlist) {
      return <Spinner />;
    }
    return (
      <div>
        <h1>Please find your name below, and click it to log in</h1>
        {this.state.studentlist &&
          splitList(this.state.studentlist).map(lst =>
            <div className="col-md-5" key={lst[0]}>
              <ul className="list-group">
                {lst.map(x =>
                  <li key={x} className="list-group-item">
                    <Link to={`/${this.props.slug}?login=${x}`}>
                      {x}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
      </div>
    );
  }
}

export default StudentLogin;
