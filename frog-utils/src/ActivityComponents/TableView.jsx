// @flow

import React from 'react'

import SpreadsheetComponent from './react-spreadsheet-component/spreadsheet';
import Dispatcher from './react-spreadsheet-component/dispatcher';

export const toTableData = (obj: Object, nRows: number, nColumns: number) => {
  const rows = Array(nRows).fill(0).map(() => Array(nColumns).fill("-"))
  Object.keys(obj).forEach(row => {
    Object.keys(obj[row]).forEach(column => {
      rows[parseInt(row)][parseInt(column)] = obj[row][column]
    })
  })
  return ({ rows })
}

export default (props: Object) => {

  const config = {
    // Initial number of row
    rows: 9,
    // Initial number of columns
    columns: 5,
    // True if the first column in each row is a header (th)
    hasHeadColumn: false,
    // True if the data for the first column is just a string.
    // Set to false if you want to pass custom DOM elements.
    isHeadColumnString: true,
    // True if the first row is a header (th)
    hasHeadRow: true,
    // True if the data for the cells in the first row contains strings.
    // Set to false if you want to pass custom DOM elements.
    isHeadRowString: true,
    // True if the user can add rows (by navigating down from the last row)
    canAddRow: false,
    // True if the user can add columns (by navigating right from the last column)
    canAddColumn: false,
    // Override the display value for an empty cell
    emptyValueSymbol: '-',
    // Fills the first column with index numbers (1...n) and the first row with index letters (A...ZZZ)
    hasLetterNumberHeads: false
  };

  const initialData = props.initialData || {
    rows: [['a', 'b', 'c', 'd', 'e']]
  };

  // SpreadsheetComponent.subscribe('cellValueChanged', function (cell, newValue, oldValue) {
  //     // cell: An array indicating the cell position by row/column, ie: [1,1]
  //     // newValue: The new value for that cell
  //     console.log(cell)
  //     console.log(newValue)
  // }, "spreadsheet-1")

  return (
    <SpreadsheetComponent
      initialData={initialData}
      config={config}
      onCellValueChange={props.onCellValueChange}
      onDataChange={props.onDataChange}
    />
  )
}
