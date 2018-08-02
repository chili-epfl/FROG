// @flow

import * as React from 'react';
import { type LearningItemT, isBrowser, flattenOne } from 'frog-utils';
import mathjs from 'mathjs';
import { assign, each } from 'lodash';
import Datasheet from 'react-datasheet';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

if (isBrowser) {
  require('./css.js');
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const AddButton = ({onClick}) =>
<Button
  onClick={onClick}
  variant="fab"
  color="primary"
  style={{width: '35px', height: '30px'}}
>
  <AddIcon />
</Button>

const RemoveButton = ({onClick}) =>
<Button
  onClick={onClick}
  variant="fab"
  color="secondary"
  style={{width: '35px', height: '30px'}}
>
  <RemoveIcon />
</Button>

class MathSheet extends React.Component<*, *> {
  // dimensions should be part of data

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

  addRow(){
    this.props.dataFn.listAppend(['', 'A', 'B', 'C', 'D', 'E'].map((col, j) => {
      if (j === 0) {
        return { readOnly: true, value: 8 };
      }
      return { value: '', key: col + 8, col: j, row: 8 };
    }))
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
    console.log(updatedCell)
    console.log(row + ' , '+col)
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
    const data = this.props.readOnly
      ? this.props.data.map(x => x.map(y => ({ ...y, readOnly: true })))
      : this.props.data;
    console.log(this.props.data)
    return (
      <div style={{ width: '800px', fontSize: '1.3em', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flexDirection: 'row', display: 'flex' }}>
        <Datasheet
          data={data}
          valueRenderer={cell => cell.value}
          dataRenderer={cell => cell.expr}
          onCellsChanged={this.onCellsChanged}
        />
        <div style={{ flexDirection: 'column', display: 'flex' }}>
        <AddButton onClick={() => {
          data.forEach((x,i) => i === 0 ? this.props.dataFn.listAppend({ readOnly: true, value: alphabet[data[0].length-1] },i) : this.props.dataFn.listAppend({ value: '', key: alphabet[data[0].length-1] + i, col: alphabet[data[0].length-1], row: i },i))
        }
        }/>
        <RemoveButton onClick={() => {

        }
        }/>
      </div>
      </div>
      <div style={{ flexDirection: 'row', display: 'flex' }}>
        <AddButton onClick={() => {
          this.props.dataFn.listAppend(['', ...alphabet.substring(0,data[0].length)].map((col, j) => {
            if (j === 0) {
              return { readOnly: true, value: data.length };
            }
            return { value: '', key: col + data.length, col: j, row: data.length };
          }))
        }
        }/>
        <RemoveButton/>
    </div>
      </div>
    );
  }
}

export default ({
  dataStructure: [0, 1, 2, 3, 4].map((row, i) =>
    ['', 'A', 'B', 'C', 'D'].map((col, j) => { // ...alphabet.substring(0,4)
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
  Viewer: ({ data }) => <MathSheet readOnly data={data} />,
  ThumbViewer: () => (
    <div>
      <Button variant="fab" color="primary">
        <i style={{ fontSize: '2em' }} className="fa fa-table" />
      </Button>Spreadsheet
    </div>
  ),
  Editor: MathSheet
}: LearningItemT<any>);
