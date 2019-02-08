// @flow

import * as React from 'react';
import {
  isBrowser,
  flattenOne,
  ReactiveText,
  type LearningItemT
} from 'frog-utils';
import mathjs from 'mathjs';
import { assign, each } from 'lodash';
import Datasheet from 'react-datasheet';
import { Fab, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

if (isBrowser) {
  require('./react-datasheet.css');
}

const numberRegex = new RegExp(/^-?\d*\.?,?\d+$/);

let IsEditing = false;

const getLetter = index =>
  index < 26
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index]
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(index / 26) - 1] +
      getLetter(index - Math.floor(index / 26) * 26);

const createArrayAlphabet = length =>
  length < 0 ? [] : [...createArrayAlphabet(length - 1), getLetter(length - 1)];

const removeCol = props =>
  props.data.forEach((x, i) => {
    if (x.length > 2) props.dataFn.listDel(x[x.length - 1], [i, x.length - 1]);
  });

const removeRow = props =>
  props.dataFn.listDel(
    props.data[props.data.length - 1],
    props.data.length - 1
  );

const AddButton = ({ onClick }) => (
  <Fab
    onClick={onClick}
    style={{ width: '35px', height: '30px', backgroundColor: 'white' }}
  >
    <AddIcon />
  </Fab>
);

const RemoveButton = ({ onClick }) => (
  <Fab
    onClick={onClick}
    style={{ width: '35px', height: '30px', backgroundColor: 'white' }}
  >
    <RemoveIcon />
  </Fab>
);

class DataEditor extends React.Component<*, *> {
  _input: any;

  componentDidMount() {
    IsEditing = true;
  }

  componentWillUnmount() {
    IsEditing = false;
    this.props.parent.forceUpdate();
  }

  render() {
    return (
      <ReactiveText
        type="textarea"
        focus
        className="data-editor"
        style={{ height: '100%', width: '100%', fontSize: '15px' }}
        onKeyDown={this.props.onKeyDown}
        dataFn={this.props.dataFn}
        path={[this.props.row, this.props.col, 'value']}
      />
    );
  }
}

class ActivityRunner extends React.Component<*, *> {
  state = {
    modalOpen: false,
    deleting: ''
  };

  shouldComponentUpdate = () => !IsEditing;

  validateExp(trailKeys, expr) {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];
    matches.forEach(match => {
      if (trailKeys.indexOf(match) > -1) {
        valid = false;
      } else {
        valid = this.validateExp(
          [...trailKeys, match],
          this.props.data[match].expr
        );
      }
    });
    return valid;
  }

  computeExpr(key, expr, scope) {
    let value = null;
    if (!expr) {
      return;
    }
    if (expr.charAt(0) !== '=') {
      return { className: '', value: expr, expr };
    } else {
      try {
        value = mathjs.eval(expr.substring(1), scope);
      } catch (e) {
        value = null;
      }

      if (value !== null) {
        // && this.validateExp([key], expr))
        return { className: 'equation', value, expr };
      } else {
        return { className: 'error', value: 'error', expr: '' };
      }
    }
  }

  cellUpdate(changeCell, expr, col, row, data) {
    const scope = flattenOne(data || this.props.data).reduce(
      (acc, x) => ({
        ...acc,
        [x.key]: Number.isNaN(x.value) ? 0 : parseFloat(x.value)
      }),
      {}
    );
    const updatedCell = assign(
      {},
      changeCell,
      this.computeExpr(changeCell.key, expr, scope)
    );
    this.props.dataFn.listReplace(changeCell, updatedCell, [row, col]);
    const tempData = this.props.data;
    tempData[row][col] = updatedCell;
    each(flattenOne(this.props.data), (cell, key) => {
      if (
        cell?.expr &&
        cell.expr.charAt(0) === '=' &&
        cell.expr.indexOf(changeCell.key) > -1 &&
        key !== changeCell.key
      ) {
        this.cellUpdate(cell, cell.expr, cell.col, cell.row, tempData);
      }
    });
  }

  onCellsChanged = changes => {
    changes.forEach(({ cell, value, col, row }) => {
      this.cellUpdate(cell, value, col, row);
    });
  };

  render() {
    const data =
      this.props.type === 'view'
        ? this.props.data.map(x => x.map(y => ({ ...y, readOnly: true })))
        : this.props.data;
    const search = this.props.search;
    const LearningItem = this.props.dataFn.LearningItem;
    return (
      <div
        style={{
          fontSize: '1.3em',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <Dialog open={this.state.modalOpen}>
            <DialogTitle>Warning</DialogTitle>
            <DialogContent>
              You are about to delete a non-empty cell
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  if (this.state.deleting === 'column') removeCol(this.props);
                  else if (this.state.deleting === 'row') removeRow(this.props);
                  this.setState({ modalOpen: false, deleting: '' });
                }}
                color="secondary"
              >
                Continue
              </Button>
              <Button
                onClick={() => {
                  this.setState({ modalOpen: false, deleting: '' });
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Datasheet
            style={{ width: '100%' }}
            data={data}
            valueRenderer={cell =>
              cell.value?.li ? (
                <div style={{ margin: '10px' }}>
                  <LearningItem type="thumbView" id={cell.value.li} />
                </div>
              ) : (
                cell.value
              )
            }
            dataRenderer={cell => cell.expr}
            dataEditor={props => (
              <DataEditor {...props} parent={this} dataFn={this.props.dataFn} />
            )}
            cellRenderer={props => (
              <td
                className={props.className}
                onMouseDown={props.onMouseDown}
                onMouseOver={props.onMouseOver}
                onDoubleClick={props.onDoubleClick}
                style={{
                  width:
                    props.col === 0
                      ? '40px'
                      : 100 / (this.props.data[0].length - 1) + '%',
                  height: '30px',
                  textAlign: numberRegex.test(data[props.row][props.col].value)
                    ? 'right'
                    : 'left'
                }}
              >
                {props.children}
              </td>
            )}
            onCellsChanged={this.onCellsChanged}
          />
          {this.props.type !== 'view' && (
            <div
              style={{
                flexDirection: 'column',
                display: 'flex',
                marginLeft: '5px'
              }}
            >
              <AddButton
                onClick={() => {
                  data.forEach((x, i) =>
                    i === 0
                      ? this.props.dataFn.listAppend(
                          { readOnly: true, value: getLetter(x.length - 1) },
                          i
                        )
                      : this.props.dataFn.listAppend(
                          {
                            value: '',
                            key: getLetter(x.length - 1) + i,
                            col: x.length,
                            row: i
                          },
                          i
                        )
                  );
                }}
              />
              <RemoveButton
                onClick={() => {
                  const empty = data.reduce(
                    (acc, curr, index) =>
                      acc &&
                      (index === 0 || curr[curr.length - 1].value === ''),
                    true
                  );
                  if (!empty)
                    this.setState({ modalOpen: true, deleting: 'column' });
                  else removeCol(this.props);
                }}
              />
            </div>
          )}
        </div>
        {this.props.type !== 'view' && (
          <div
            style={{
              flexDirection: 'row',
              display: 'flex',
              margin: '5px'
            }}
          >
            <AddButton
              onClick={() => {
                this.props.dataFn.listAppend(
                  createArrayAlphabet(data[0].length - 1).map((col, j) => {
                    if (j === 0) {
                      return { readOnly: true, value: data.length };
                    }
                    return {
                      value: '',
                      key: col + data.length,
                      col: j,
                      row: data.length
                    };
                  })
                );
              }}
            />
            <RemoveButton
              onClick={() => {
                if (data.length > 2) {
                  const empty = data[data.length - 1].reduce(
                    (acc, curr, index) =>
                      acc && (index === 0 || curr.value === ''),
                    true
                  );
                  if (!empty)
                    this.setState({ modalOpen: true, deleting: 'row' });
                  else removeRow(this.props);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

const ActivityRunnerSpecialized = ({ data, dataFn, ...rest }) => (
  <ActivityRunner
    data={data.sheet}
    dataFn={dataFn.specialize('sheet')}
    {...rest}
  />
);

export default ({
  dataStructure: [0, 1, 2, 3, 4].map((row, i) =>
    ['', 'A', 'B', 'C', 'D'].map((col, j) => {
      if (i === 0 && j === 0) {
        return { readOnly: true, value: '                ' };
      }
      if (row === 0) {
        return { readOnly: true, value: col };
      }
      if (j === 0) {
        return { readOnly: true, value: row };
      }
      return { value: '', key: col + row, col: j, row: i };
    })
  ),
  name: 'Spreadsheet',
  id: 'li-spreadsheet',
  //  $FlowFixMe
  Viewer: ActivityRunner,
  ThumbViewer: () => (
    <div>
      <Fab color="primary">
        <i style={{ fontSize: '2em' }} className="fa fa-table" />
      </Fab>
      Spreadsheet
    </div>
  ),
  Editor: ActivityRunner,
  search: (data, search) =>
    JSON.stringify(data)
      .toLowerCase()
      .includes(search)
}: LearningItemT<any>);
