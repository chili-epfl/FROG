import * as React from 'react';
import { HTML, type ActivityRunnerPropsT } from '/imports/frog-utils';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

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
  state = { editing: this.props.activityData.config.openIncomingInEdit };

  componentDidMount = () => {
    const { logger, activityData } = this.props;
    if (activityData.config.submit) {
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
        {conf.instructions && <HTML html={conf.instructions} />}
      </>
    );

    if (data.li) {
      return (
        <div style={style}>
          {header}
          <dataFn.LearningItem
            type={this.state.editing || !conf.submit ? 'edit' : 'view'}
            id={data.li}
            clickZoomable
            fallback="view"
            render={({ editable, children, hasCreator }) => (
              <>
                {children}
                {!editing && conf.submit && conf.allowEditing && (
                  <Fab
                    onClick={() => this.setState({ editing: true })}
                    color="secondary"
                    aria-label="edit"
                  >
                    <EditIcon /> :
                  </Fab>
                )}
                {editing && conf.submit && editable && (
                  <Button
                    onClick={() => this.setState({ editing: false })}
                    color="primary"
                    variant="contained"
                    aria-label="save"
                  >
                    Save
                  </Button>
                )}
                {hasCreator && (
                  <Fab
                    onClick={() => {
                      dataFn.objDel(null, 'li');
                      this.setState({ editing: true });
                    }}
                    color="secondary"
                    aria-label="delete"
                    style={{ float: 'right' }}
                  >
                    <CloseIcon />
                  </Fab>
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
            liType={conf.liTypeEditor}
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
