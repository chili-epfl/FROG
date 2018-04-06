import * as React from 'react';

import { uuid, TableView, TreeView, toTableData } from 'frog-utils';

const View = ({ data, dataFn }) => (
  <TableView
    onCellValueChange={event => {
      const [cell, newValue] = event;
      if (data[cell[0].toString()]) {
        dataFn.objInsert(newValue, [cell[0].toString(), cell[1].toString()]);
      } else {
        dataFn.objInsert({ [cell[1].toString()]: newValue }, [
          cell[0].toString()
        ]);
      }
    }}
    initialData={toTableData(data, 10, 5)}
  />
);

export default {
  viewThumb: View,
  editable: true,
  zoomable: true,
  edit: View,
  name: 'Table',
  id: 'li-table',
  dataStructure: {
    '0': {
      '0': 'La montre est derrière',
      '1': 'Choix initial',
      '2': 'HEC ouvre la porte',
      '3': 'Change de choix',
      '4': 'Ne change pas'
    },
    '1': {
      '0': 'A',
      '1': 'A',
      '2': 'B ou C',
      '3': 'A',
      '4': 'C ou B'
    }
  }
};
