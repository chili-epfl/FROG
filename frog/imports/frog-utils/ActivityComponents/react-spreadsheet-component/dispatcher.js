/* eslint-disable */
const Mousetrap = require('mousetrap');
const $ = require('jquery');

const dispatcher = {
  // Event Pub/Sub System
  //
  // Topics used:
  // [headCellClicked] - A head cell was clicked
  //      @return {array} [row, column]
  // [cellSelected] - A cell was selected
  //      @return {array} [row, column]
  // [cellBlur] - A cell was blurred
  //      @return {array} [row, column]
  // [cellValueChanged] - A cell value changed.
  //      @return {cell, newValue} Origin cell, new value entered
  // [dataChanged] - Data changed
  //      @return {data} New data
  // [editStarted] - The user started editing
  //      @return {cell} Origin cell
  // [editStopped] - The user stopped editing
  //      @return {cell} Origin cell
  // [rowCreated] - The user created a row
  //      @return {number} Row index
  // [columnCreated] - The user created a column
  //      @return {number} Column index
  topics: {},

  /**
     * Subscribe to an event
     * @param  {string} topic         [The topic subscribing to]
     * @param  {function} listener    [The callback for published events]
     * @param  {string} spreadsheetId [The reactId (data-spreadsheetId) of the origin element]
     */
  subscribe(topic, listener, spreadsheetId) {
    if (!this.topics[spreadsheetId]) {
      this.topics[spreadsheetId] = [];
    }

    if (!this.topics[spreadsheetId][topic]) {
      this.topics[spreadsheetId][topic] = [];
    }

    this.topics[spreadsheetId][topic].push(listener);
  },

  /**
     * Publish to an event channel
     * @param  {string} topic         [The topic publishing to]
     * @param  {object} data          [An object passed to the subscribed callbacks]
     * @param  {string} spreadsheetId [The reactId (data-spreadsheetId) of the origin element]
     */
  publish(topic, data, spreadsheetId) {
    // return if the topic doesn't exist, or there are no listeners
    if (
      !this.topics[spreadsheetId] ||
      !this.topics[spreadsheetId][topic] ||
      this.topics[spreadsheetId][topic].length < 1
    ) {
      return;
    }

    this.topics[spreadsheetId][topic].forEach(listener => {
      listener(data || {});
    });
  },

  keyboardShortcuts: [
    // Name, Keys, Events
    ['down', 'down', ['keyup']],
    ['up', 'up', ['keyup']],
    ['left', 'left', ['keyup']],
    ['right', 'right', ['keyup']],
    ['tab', 'tab', ['keyup', 'keydown']],
    ['enter', 'enter', ['keyup']],
    ['esc', 'esc', ['keyup']],
    ['remove', ['backspace', 'delete'], ['keyup', 'keydown']],
    [
      'letter',
      [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'x',
        'w',
        'y',
        'z',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0',
        '=',
        '.',
        ',',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'X',
        'W',
        'Y',
        'Z'
      ],
      ['keyup', 'keydown']
    ]
  ],

  /**
     * Initializes the keyboard bindings
     * @param {object} domNode [The DOM node of the element that should be bound]
     * @param {string} spreadsheetId [The id of the spreadsheet element]
     */
  setupKeyboardShortcuts(domNode, spreadsheetId) {
    const self = this;
    this.keyboardShortcuts.map(shortcut => {
      let shortcutName = shortcut[0],
        shortcutKey = shortcut[1],
        events = shortcut[2];

      events.map(event => {
        Mousetrap(domNode).bind(
          shortcutKey,
          e => {
            self.publish(shortcutName + '_' + event, e, spreadsheetId);
          },
          event
        );
      });

      if (shortcutName === 'letter') {
        events.map(event => {
          Mousetrap(domNode).bind(
            shortcutKey.map(x => 'shift+' + x),
            e => {
              self.publish(shortcutName + '_' + event, e, spreadsheetId);
            },
            event
          );
        });
      }
    });

    // Avoid scroll
    window.addEventListener(
      'keydown',
      e => {
        // space and arrow keys
        if (
          [32, 37, 38, 39, 40].indexOf(e.keyCode) > -1 &&
          $(document.activeElement)[0].tagName !== 'INPUT'
        ) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            // Oh, old IE, you 💩
            e.returnValue = false;
          }
        }
      },
      false
    );
  }
};

module.exports = dispatcher;
