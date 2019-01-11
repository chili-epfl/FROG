import * as React from 'react';
import { HTML, type ActivityRunnerPropsT } from 'frog-utils';
import Fab from '@material-ui/core/Fab';
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
            <HTML html={conf.instructions} />
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
            type={this.state.editing || conf.noSubmit ? 'edit' : 'view'}
            id={data.li}
            clickZoomable
            render={({ editable, children }) => (
              <>
                {children}
                {!editing &&
                  !conf.noSubmit &&
                  conf.allowEditing && (
                    <Fab
                      onClick={() =>
                        editable
                          ? this.setState({ editing: true })
                          : dataFn.objDel(null, 'li')
                      }
                      color="secondary"
                      aria-label={editable ? 'edit' : 'delete'}
                    >
                      {editable ? <EditIcon /> : <CloseIcon />}
                    </Fab>
                  )}
                {editing &&
                  !conf.noSubmit && (
                    <Button
                      onClick={() => this.setState({ editing: false })}
                      color="primary"
                      variant="contained"
                      aria-label="save"
                    >
                      Save
                    </Button>
                  )}
              </>
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
            liType={conf.nosubmit ? conf.liTypeEditor : conf.liType}
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
