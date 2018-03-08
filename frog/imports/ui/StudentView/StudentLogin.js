// @flow
import * as React from 'react';
import { isEmpty } from 'lodash';
import Form from 'react-jsonschema-form';
import { Button } from 'react-bootstrap';

const splitList = (liststr: string) => {
  const list = liststr.trim().split('\n');
  const extra = list.length % 2 ? 1 : 0;
  const length = list.length / 2;
  return [list.slice(0, length + extra), list.slice(length + extra)];
};

type SettingsT = {
  loginByName: boolean,
  secret?: boolean,
  secretString?: string,
  specifyName: boolean,
  studentlist?: string
};

type StudentLoginPropsT = {
  login: Function,
  settings: SettingsT
};

class StudentLogin extends React.Component<
  StudentLoginPropsT,
  { selected: string | null }
> {
  secret: ?string;
  name: ?string;

  constructor(props: StudentLoginPropsT) {
    super(props);
    this.state = { selected: null };
  }

  login = () => {
    const settings = this.props.settings;
    if (
      settings.secret &&
      settings.secretString &&
      !isEmpty(settings.secretString)
    ) {
      if (
        !this.secret ||
        settings.secretString.trim().toUpperCase() !==
          (this.secret && this.secret.trim().toUpperCase())
      ) {
        // eslint-disable-next-line no-alert
        window.alert('Secret token is not correct');
        return;
      }
    }
  };

  render() {
    const settings = this.props.settings;
    if (
      !settings ||
      settings.loginByName === false ||
      (!settings.specifyName && isEmpty(settings.studentlist))
    ) {
      return <h1>Must log in to access this session</h1>;
    }
    return (
      <React.Fragment>
        {settings.studentlist && (
          <div className="row" style={{ marginLeft: '10px' }}>
            <h2>Select your name below</h2>
            {splitList(settings.studentlist).map(lst => (
              <div className="col-md-5" key={lst[0]}>
                <ul className="list-group">
                  {lst.map(x => (
                    <li
                      key={x}
                      className={
                        this.state.selected === x
                          ? 'active list-group-item'
                          : 'list-group-item'
                      }
                      onClick={() => {
                        if (this.state.selected === x) {
                          this.setState({ selected: null });
                        } else {
                          this.setState({ selected: x });
                        }
                      }}
                    >
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div
          className="row"
          style={{ marginLeft: '10px', marginRight: '20px' }}
        >
          {settings.specifyName && (
            <React.Fragment>
              <h2>Log in as new user:</h2>
              {this.state.selected ? (
                <p>
                  Cancel the selection above, to be able to specify a new name
                </p>
              ) : (
                <Form
                  schema={{ title: 'Your name', type: 'string' }}
                  onChange={({ formData }) => (this.name = formData)}
                >
                  <br />
                </Form>
              )}
            </React.Fragment>
          )}
          {settings.secret &&
            !isEmpty(settings.secretString) && (
              <React.Fragment>
                <h2>Secret token:</h2>
                <Form
                  schema={{
                    title:
                      'Your teacher should have given you a secret token, please fill it in',
                    type: 'string'
                  }}
                  onChange={({ formData }) => (this.secret = formData)}
                >
                  <br />
                </Form>
              </React.Fragment>
            )}
        </div>
        <Button
          style={{ marginLeft: '10px' }}
          onClick={this.login}
          className="btn btn-success"
        >
          Log in
        </Button>
      </React.Fragment>
    );
  }
}

export default StudentLogin;
