// @flow

import { uuid } from 'frog-utils';
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import * as Colors from 'material-ui/colors';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class NoteDialog extends Component {
  state: {
    selectedValue: number,
    userText: string,
    userNoteType: {},
    userTags: []
  };
  _onHandleRequestClose: any;
  _onHandleRequestSubmit: any;
  _handleTextFieldChange: any;

  constructor(props: Object) {
    super(props);

    const { activityData } = this.props;
    const { config } = activityData;
    const { noteTypes } = config;

    console.log('noteTypes', noteTypes); // eslint-disable-line no-console
    this.state = {
      selectedValue: 0,
      userText:
        noteTypes[0].sentenceStarter !== undefined
          ? noteTypes[0].sentenceStarter
          : '',
      userNoteType: noteTypes[0],
      userTags: []
    };

    this._onHandleRequestClose = this._onHandleRequestClose.bind(this);
    this._onHandleRequestSubmit = this._onHandleRequestSubmit.bind(this);
    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
  }

  handleListItemClick = (value: number) => {
    const { activityData } = this.props;
    const { config } = activityData;
    const { noteTypes } = config;

    this.setState({
      selectedValue: value,
      userNoteType: noteTypes[value],
      userText:
        noteTypes[value].sentenceStarter !== undefined
          ? noteTypes[value].sentenceStarter
          : ''
    });
  };

  handleToggle = (event: any, index: number) => {
    const { userTags } = this.state;
    const currentIndex = userTags.indexOf(index);
    const newChecked = [...userTags];

    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      userTags: newChecked
    });
  };

  _handleTextFieldChange(event: any) {
    const { activityData } = this.props;
    const { config } = activityData;
    const { noteTypes } = config;

    this.setState({
      selectedValue: this.state.selectedValue,
      userText: event.target.value,
      userNoteType: noteTypes[this.state.selectedValue]
    });

    // console.log('new text state', this.state);
  }

  _onHandleRequestClose() {
    if (this.props.onHandleRequestClose) {
      this.props.onHandleRequestClose();
    }
  }

  _onHandleRequestSubmit() {
    const { activityData } = this.props;
    const { config } = activityData;
    const { classTags } = config;
    const { userTags } = this.state;

    const foundTags = userTags.map((value, index) => classTags[value]);

    const n = {
      note: this.state.userText,
      noteType: this.state.userNoteType,
      user: this.props.userInfo,
      userTags: foundTags
    };
    this.props.dataFn.objInsert(n, uuid());

    if (this.props.onHandleRequestClose) {
      this.props.onHandleRequestClose();
    }
  }

  render() {
    const containerCardStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      backgroundColor: 'white'
    };
    const basicContainerStyle = {
      paddingLeft: 16
    };
    const fieldsContainerStyle = {
      ...basicContainerStyle,
      width: 250
    };
    // const tagListStyle = {
    //   paddingTop: 16,
    //   paddingRight: 1,
    //   paddingBottom: 1,
    //   paddingLeft: 43,
    //   marginBottom: 5
    // };

    const { open, activityData } = this.props;
    const { noteTypes, classTags } = activityData.config;
    let tagItems = [];
    if (classTags !== undefined) {
      tagItems = classTags.map((value, index) => (
        <ListItem
          dense
          button
          onClick={event => this.handleToggle(event, index)}
          key={index}
        >
          <Checkbox
            checked={this.state.userTags.indexOf(index) !== -1}
            tabIndex="-1"
            disableRipple
          />
          <ListItemText primary={value.title} />
        </ListItem>
      ));
    }

    let noteItems = [];
    if (noteTypes !== undefined) {
      noteItems = noteTypes.map((noteType, index) => (
        <ListItem
          button
          divider
          onClick={() => this.handleListItemClick(index)}
          key={index}
        >
          <ListItemText primary={noteType.noteType} />
        </ListItem>
      ));
    }

    return (
      <div>
        <Dialog open={open} onRequestClose={this._onHandleRequestClose}>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogContent>
            <main id="notes" style={containerCardStyle}>
              <div>
                <div>NOTE TYPES</div>
                <List>{noteItems}</List>
              </div>
              <div>
                <div style={fieldsContainerStyle}>
                  {noteTypes === undefined
                    ? 'No Selected Note'
                    : noteTypes[
                        this.state.selectedValue
                      ].noteType.toUpperCase() + ' NOTE'}
                </div>
                <br />
                <div style={fieldsContainerStyle}>
                  <TextField
                    label={
                      noteTypes === undefined
                        ? 'No Prompt'
                        : noteTypes[this.state.selectedValue].prompt
                    }
                    multiline
                    margin="normal"
                    fullWidth
                    rows={8}
                    style={{ backgroundColor: Colors.grey }}
                    value={this.state.userText}
                    onChange={this._handleTextFieldChange}
                  />
                </div>
              </div>
              <div>
                <div style={basicContainerStyle}>TAGS</div>

                <div style={basicContainerStyle}>Select one or more tags.</div>
                <List>
                  {tagItems !== undefined ? (
                    tagItems
                  ) : (
                    <ListItem value={1} primaryText="No Tags" />
                  )}
                </List>
              </div>
            </main>
          </DialogContent>
          <DialogActions>
            <Button onClick={this._onHandleRequestClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this._onHandleRequestSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
