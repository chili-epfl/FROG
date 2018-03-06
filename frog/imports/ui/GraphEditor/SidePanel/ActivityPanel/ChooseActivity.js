// @flow
import React, { Component } from 'react';
import { type ActivityPackageT, type ActivityDbT } from 'frog-utils';
import { activityTypes } from '/imports/activityTypes';
import { Activities } from '/imports/api/activities';
import { Button } from 'react-bootstrap';

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
  activity: ActivityDbT
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
    const select = this.props.onSelect
      ? this.props.onSelect
      : activityType => {
          Activities.update(this.props.activity._id, {
            $set: { activityType: activityType.id }
          });
          if (this.props.store) {
            console.log('add history')
            console.log(this.props)
            // this.props.store.activityStore.mongoChange(new, old)
            this.props.store.activityStore.mongoChange(this.props.activity, this.props.activity)
            this.props.store.addHistory();
          }
        };

    const changeSearch = e =>
      this.setState({
        expanded: null,
        searchStr: e.target.value.toLowerCase()
      });

    const filteredList = activityTypes
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
          width: '100%',
          transform: 'translateY(-40px)'
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
                    onPreview={() =>
                      this.props.store &&
                      this.props.store.ui.setShowPreview({
                        activityTypeId: x.id
                      })
                    }
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
