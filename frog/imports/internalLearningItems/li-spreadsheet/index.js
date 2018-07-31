// @flow

import * as React from 'react';
import { type LearningItemT, isBrowser, flattenOne } from 'frog-utils';
import mathjs from 'mathjs';
import { assign, each } from 'lodash';
import Datasheet from 'react-datasheet';
import { Button } from '@material-ui/core';

if (isBrowser) {
  require('./css.js');
}

class MathSheet extends React.Component<*, *> {
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
    const data = this.props.readOnly
      ? this.props.data.map(x => x.map(y => ({ ...y, readOnly: true })))
      : this.props.data;
    return (
      <div style={{ width: '800px', fontSize: '1.3em' }}>
        <Datasheet
          data={data}
          valueRenderer={cell => cell.value}
          dataRenderer={cell => cell.expr}
          onCellsChanged={this.onCellsChanged}
        />
      </div>
    );
  }
}

export default ({
  dataStructure: [0, 1, 2, 3, 4, 5, 6, 7].map((row, i) =>
    ['', 'A', 'B', 'C', 'D', 'E'].map((col, j) => {
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
