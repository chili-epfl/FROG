// @flow
import React, { Component } from 'react';
import { type ActivityPackageT, type ActivityDbT } from 'frog-utils';
import { activityTypes } from '/imports/activityTypes';
import { addActivity } from '/imports/api/activities';
import { Button } from 'react-bootstrap';
import jsonSchemaDefaults from 'json-schema-defaults';

import ActivityLibrary from './ActivityLibrary';
import ListComponent from '../ListComponent';
import Preview from '../../../Preview/Preview';
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
  importList?: Array<Object>,
  setImportList?: Function,
  onlyHasPreview?: boolean
};

export class ChooseActivityType extends Component<PropsT, StateT> {
  inputRef: any;

  constructor(props: PropsT) {
    super(props);
    this.state = {
      expanded: null,
      searchStr: '',
      showInfo: null
    };
    this.inputRef = null;
  }

  render() {
    const activityTypesFiltered = this.props.onlyHasPreview
      ? activityTypes.filter(x => x.meta.exampleData !== undefined)
      : activityTypes;
    const select = this.props.onSelect
      ? this.props.onSelect
      : aT => {
          const defaultConf = jsonSchemaDefaults(aT.config);
          addActivity(aT.id, defaultConf, this.props.activity._id);
          if (this.props.store) {
            this.props.store.addHistory();
          }
        };

    const changeSearch = e =>
      this.setState({
        expanded: null,
        searchStr: e.target.value.toLowerCase()
      });

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
      <div
        style={{
          height: '100%',
          width: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '95%',
            height: '35px'
          }}
        >
          <h4>Select activity type</h4>
          <div
            className="input-group"
            style={{ top: '5px', left: '10px', width: '200px' }}
          >
            <span className="input-group-addon" id="basic-addon1">
              <span className="glyphicon glyphicon-search" aria-hidden="true" />
            </span>
            <input
              ref={ref => (this.inputRef = ref)}
              type="text"
              style={{ zIndex: 0 }}
              onChange={changeSearch}
              className="form-control"
              placeholder="Search for..."
              aria-describedby="basic-addon1"
            />
          </div>
          <Button
            className={
              this.props.store &&
              (this.props.store.ui.libraryOpen
                ? 'btn btn-success'
                : 'btn btn-primary')
            }
            style={{
              position: 'relative',
              top: '5px',
              left: '15px',
              width: '100px'
            }}
            onClick={() =>
              this.props.store &&
              this.props.store.ui.setLibraryOpen(
                !this.props.store.ui.libraryOpen
              )
            }
          >
            {' '}
            {this.props.store &&
              (this.props.store.ui.libraryOpen
                ? 'New activity'
                : 'Library')}{' '}
          </Button>
        </div>
        {this.props.store &&
          (this.props.store.ui.libraryOpen ? (
            <ActivityLibrary
              {...closeLibrary}
              importList={this.props.importList}
              setImportList={this.props.setImportList}
              setDelete={this.props.setDelete}
              setIdRemove={this.props.setIdRemove}
              activityId={this.props.activity._id}
              searchStr={this.state.searchStr}
              store={this.props.store}
            />
          ) : (
            <div
              className="list-group"
              style={{
                height: '93%',
                width: '100%',
                overflowY: 'scroll',
                transform: 'translateY(10px)'
              }}
            >
              {filteredList.length === 0 ? (
                <div
                  style={{
                    marginTop: '20px',
                    marginLeft: '10px',
                    fontSize: '40px'
                  }}
                >
                  No result
                </div>
              ) : (
                filteredList.map((x: ActivityPackageT) => (
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
                ))
              )}
            </div>
          ))}
        {this.state.showInfo !== null && (
          <Preview
            activityTypeId={this.state.showInfo}
            dismiss={() => this.setState({ showInfo: null })}
          />
        )}
      </div>
    );
  }
}

export default connect(ChooseActivityType);
