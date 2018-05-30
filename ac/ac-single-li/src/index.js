// @flow

import * as React from 'react';
import {
  type ActivityPackageT,
  type ActivityRunnerPropsT,
  uuid,
  ProgressDashboard
} from 'frog-utils';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

const meta = {
  name: 'Add/edit single LI',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available'
};

const config = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Title' },
    instructions: { type: 'string', title: 'Instructions' },
    liType: {
      title: 'Learning Item Type',
      type: 'learningItemType'
    },
    allowEditing: {
      title: 'Allow editing after submission',
      default: true,
      type: 'boolean'
    }
  }
};

const formatProduct = (_, product) => {
  const id = uuid();
  return product.li ? { [id]: { id, li: product.li } } : {};
};

const configUI = { instructions: { 'ui:widget': 'textarea' } };

const dataStructure = {};

const style = {
  margin: 'auto',
  backgroundColor: '#fff',
  padding: 40,
  height: '100%'
};

// the actual component that the student sees
class ActivityRunner extends React.Component<
  ActivityRunnerPropsT,
  { editing: boolean }
> {
  state = { editing: false };

  componentDidMount = () => this.props.logger({ type: 'progress', value: 0 });

  render() {
    const {
      activityData: { config: conf },
      data,
      dataFn
    } = this.props;

    const { editing } = this.state;

    const header = (
      <>
        {conf.title && <h1>{conf.title}</h1>}
        {conf.instructions && (
          <p>
            <b>{conf.instructions}</b>
          </p>
        )}
      </>
    );

    if (data.li) {
      return (
        <div style={style}>
          {header}
          <dataFn.LearningItem
            type={this.state.editing ? 'edit' : 'thumbView'}
            id={data.li}
            clickZoomable
            render={({ editable, children }) => (
              <div>
                {children}
                {!editing &&
                  conf.allowEditing && (
                    <Button
                      onClick={() =>
                        editable
                          ? this.setState({ editing: true })
                          : dataFn.objDel(null, 'li')
                      }
                      variant="fab"
                      color="secondary"
                      aria-label={editable ? 'edit' : 'delete'}
                    >
                      {editable ? <EditIcon /> : <CloseIcon />}
                    </Button>
                  )}
                {editing && (
                  <Button
                    onClick={() => this.setState({ editing: false })}
                    color="primary"
                    variant="raised"
                    aria-label="save"
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          />
        </div>
      );
    } else {
      return (
        <div style={style}>
          {header}
          <dataFn.LearningItem
            type="create"
            liType={conf.liType}
            onCreate={li => {
              dataFn.objInsert(li, 'li');
              this.props.logger({ type: 'progress', value: 1 });
            }}
          />
        </div>
      );
    }
  }
}

export default ({
  id: 'ac-single-li',
  type: 'react-component',
  meta,
  config,
  configUI,
  formatProduct,
  ActivityRunner,
  dashboards: { progress: ProgressDashboard },
  dataStructure
}: ActivityPackageT);
