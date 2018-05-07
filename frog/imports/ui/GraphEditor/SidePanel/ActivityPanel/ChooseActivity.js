// @flow
import React, { Component } from 'react';
import { type ActivityPackageT, type ActivityDbT } from 'frog-utils';
import { activityTypes } from '/imports/activityTypes';
import { addActivity } from '/imports/api/activities';
import jsonSchemaDefaults from 'json-schema-defaults';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import List from 'material-ui/List';

import Library from '../../RemoteControllers/RemoteLibrary';
import ListComponent from '../ListComponent';
import { ModalPreview } from '../../../Preview';
import { connect } from '../../store';

type StateT = {
  expanded: ?string,
  searchStr: string,
  showInfo: ?string
};
type PropsT = {
  store?: Object,
  hidePreview?: boolean,
  onSelect?: Function,
  onPreview?: Function,
  activity: ActivityDbT,
  setDelete?: Function,
  setIdRemove?: Function,
  onlyHasPreview?: boolean,
  locallyChanged?: boolean,
  changesLoaded?: Function
};

const ToggleChooseActivityLibraryButton = props => (
  <Button color="primary" onClick={props.onToggle}>
    {props.store && (props.store.ui.libraryOpen ? 'New activity' : 'Library')}{' '}
  </Button>
);

export class ChooseActivityType extends Component<PropsT, StateT> {
  inputRef: any;

  constructor(props: PropsT) {
    super(props);
    this.container = React.createRef();
    this.state = {
      expanded: null,
      searchStr: '',
      showInfo: null
    };
    this.inputRef = null;
  }

  handleToggle = () => {
    if (this.props.store) {
      this.props.store.ui.setLibraryOpen(!this.props.store.ui.libraryOpen);
    }
  };

  handleSearch = e => {
    this.setState({
      expanded: null,
      searchStr: e.target.value.toLowerCase()
    });
  };

  render() {
    const activityTypesFiltered = this.props.onlyHasPreview
      ? activityTypes.filter(x => x.meta.exampleData !== undefined)
      : activityTypes;

    const select = this.props.onSelect
      ? this.props.onSelect
      : aT => {
          const defaultConf = jsonSchemaDefaults(aT.config);
          addActivity(aT.id, defaultConf, this.props.activity._id);
          const { store, activity } = this.props;
          if (store) {
            if (activity.title && activity.title === 'Unnamed') {
              const graphActivity = store.activityStore.all.find(
                act => act.id === activity._id
              );
              const newName = aT.meta.shortName || aT.meta.name;
              graphActivity.rename(newName);
            }
            store.addHistory();
          }
        };

    const filteredList = activityTypesFiltered
      .filter(
        x =>
          x.meta.name.toLowerCase().includes(this.state.searchStr) ||
          x.meta.shortDesc.toLowerCase().includes(this.state.searchStr) ||
          x.meta.description.toLowerCase().includes(this.state.searchStr)
      )
      .sort((x: Object, y: Object) => (x.meta.name < y.meta.name ? -1 : 1));

    const closeLibrary = () =>
      this.props.store && this.props.store.ui.setLibraryOpen(false);

    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="title" gutterBottom component="p">
            Select activity type
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <input
            ref={ref => (this.inputRef = ref)}
            type="text"
            style={{ zIndex: 0 }}
            onChange={this.handleSearch}
            className="form-control"
            placeholder="Search for..."
            aria-describedby="basic-addon1"
          />
        </Grid>
        <Grid item xs={4}>
          <ToggleChooseActivityLibraryButton
            onToggle={this.handleToggle}
            {...this.props}
          />
        </Grid>
        {this.props.store &&
          (this.props.store.ui.libraryOpen ? (
            <Library
              {...closeLibrary}
              libraryType="activity"
              setDelete={this.props.setDelete}
              setIdRemove={this.props.setIdRemove}
              activityId={this.props.activity._id}
              store={this.props.store}
              locallyChanged={this.props.locallyChanged}
              changesLoaded={this.props.changesLoaded}
            />
          ) : (
            <Grid
              item
              xs={12}
              style={{ maxHeight: '700px', overflowY: 'auto' }}
            >
              {filteredList.length === 0 ? (
                <div>No result</div>
              ) : (
                <List>
                  {filteredList.map((x: ActivityPackageT) => (
                    <ListComponent
                      hasPreview={
                        !this.props.hidePreview &&
                        x.meta.exampleData !== undefined
                      }
                      onSelect={() => select(x)}
                      showExpanded={this.state.expanded === x.id}
                      expand={() => this.setState({ expanded: x.id })}
                      key={x.id}
                      onPreview={() => {
                        if (this.props.onPreview) {
                          this.props.onPreview(x.id);
                        } else if (this.props.store) {
                          this.props.store.ui.setShowPreview({
                            activityTypeId: x.id
                          });
                        }
                      }}
                      object={x}
                      searchS={this.state.searchStr}
                      eventKey={x.id}
                    />
                  ))}
                </List>
              )}
            </Grid>
          ))}
        {this.state.showInfo !== null && (
          <ModalPreview
            activityTypeId={this.state.showInfo}
            dismiss={() => this.setState({ showInfo: null })}
          />
        )}
      </Grid>
    );
  }
}

export default connect(ChooseActivityType);
