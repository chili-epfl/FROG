// @flow
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Spinner from 'react-spinner';
import { A } from 'frog-utils';
import { isEmpty } from 'lodash';

const splitList = (liststr: string) => {
  const list = liststr.trim().split('\n');
  const extra = list.length % 2 ? 1 : 0;
  const length = list.length / 2;
  return [list.slice(0, length + extra), list.slice(length + extra)];
};

type SettingsT = {
  loginByName: boolean,
  hasSecret: boolean,
  specifyName: boolean,
  studentlist: string
};

type StudentLoginPropsT = {
  login: Function,
  settings: SettingsT
};

class StudentLogin extends Component<StudentLoginPropsT, void> {
  render() {
    console.log(this.props);
    const settings = this.props.settings;
    if (
      !settings ||
      settings.loginByName === false ||
      (!settings.specifyName && isEmpty(settings.studentlist))
    ) {
      return <h1>Must log in to access this session</h1>;
    }
    return (
      <div>
        <h1>Please find your name below, and click it to log in</h1>
        {settings.studentlist &&
          splitList(settings.studentlist).map(lst => (
            <div className="col-md-5" key={lst[0]}>
              <ul className="list-group">
                {lst.map(x => (
                  <li key={x} className="list-group-item">
                    <A onClick={() => this.props.login(x, null, true)}>{x}</A>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    );
  }
}

export default StudentLogin;
