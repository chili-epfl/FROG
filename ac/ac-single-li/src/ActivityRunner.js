import * as React from 'react';
import { type ActivityRunnerPropsT } from 'frog-utils';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

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

  componentDidMount = () => {
    const { logger, activityData } = this.props;
    if (!activityData.config.noSubmit) {
      logger({ type: 'progress', value: 0 });
    }
  };

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

    if (conf.noSubmit && !data.li) {
      return <CircularProgress />;
    }

    if (data.li) {
      return (
        <div style={style}>
          {header}
          <dataFn.LearningItem
            type={this.state.editing || conf.noSubmit ? 'edit' : 'thumbView'}
            id={data.li}
            clickZoomable
            render={({ editable, children }) => (
              <div>
                {children}
                {!editing &&
                  !conf.noSubmit &&
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
                {editing &&
                  !conf.noSubmit && (
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
            liType={conf.liType || conf.liTypeEditor}
            onCreate={li => {
              dataFn.objInsert(li, 'li');
              this.props.logger({ type: 'progress', value: 1 });
              this.props.stream({ li });
              this.forceUpdate();
            }}
          />
        </div>
      );
    }
  }
}

export default ActivityRunner;
