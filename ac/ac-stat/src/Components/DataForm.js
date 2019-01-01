// @flow

import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Clear';
import Replay from '@material-ui/icons/Replay';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = () => ({
  root: {
    maxWidth: '25%',
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '4px',
    margin: '4px'
  },
  table: {
    border: 'solid 1px',
    flex: '1 0 0px',
    overflow: 'auto'
  },
  head1: {
    fontSize: 'large',
    backgroundColor: '#ddd',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    cursor: 'pointer'
  },
  head2: {
    fontSize: 'large',
    backgroundColor: '#ddd',
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  header: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selector: {
    flex: '1 0 auto'
  }
});

const TableHeader = ({
  columns,
  classes,
  editable,
  sortBy,
  logger,
  dataset
}) => (
  <TableHead>
    <TableRow>
      {columns.map((axis, i) => (
        <TableCell
          className={classes.head1}
          key={axis}
          onClick={() => {
            logger({ type: 'sort', itemId: dataset, value: i });
            sortBy(i);
          }}
        >
          {axis}
        </TableCell>
      ))}
      {editable && <TableCell className={classes.head2}>Action</TableCell>}
    </TableRow>
  </TableHead>
);

const AddElementRow = ({ data, dataFn, dataset, logger }) => (
  <TableRow>
    <TableCell>
      <IconButton
        onClick={() => {
          logger({ type: 'added entry', itemId: dataset });
          dataFn.listAppend(data.columns.map(() => ''), [dataset, 'values']);
        }}
      >
        <Add />
      </IconButton>
    </TableCell>
  </TableRow>
);

const DeleteElementCell = ({ dataFn, entry, dataset, index, logger }) => (
  <TableCell>
    <IconButton
      onClick={() => {
        logger({
          type: 'delete entry',
          itemId: dataset,
          value: index
        });
        dataFn.listDel(entry, [dataset, 'values', index]);
      }}
    >
      <Remove />
    </IconButton>
  </TableCell>
);

const DatasetSelector = ({ dataset, datasets, changeDataset, classes }) => (
  <Select className={classes.selector} value={dataset} onChange={changeDataset}>
    {Object.keys(datasets).map(name => (
      <MenuItem value={name} key={name} selected>
        {name}
      </MenuItem>
    ))}
  </Select>
);

const RefreshDataset = ({
  logger,
  dataFn,
  data,
  dataset,
  setTransformation,
  originalData
}) => (
  <IconButton
    onClick={() => {
      logger({ type: 'reset', itemId: dataset });
      dataFn.objReplace(data, originalData[dataset], dataset);
      setTransformation('');
    }}
  >
    <Replay />
  </IconButton>
);

const displayEntry = e => {
  const x = Number(e);
  const between = (a, mini, maxi) => a > mini && a < maxi;
  if (Number.isNaN(x)) {
    return e;
  } else if (x === 0 || between(x, 0.1, 10000) || between(x, -10000, -0.1)) {
    return Number.isInteger(x) ? x : x.toFixed(2);
  } else {
    return x.toExponential(2);
  }
};

class Data extends React.Component<*, *> {
  el: any;
  state = {
    selected: [-1, -1],
    cellStr: '',
    sort: -1
  };

  render() {
    const { classes, data, dataFn, dataset, logger, editable } = this.props;
    const { sort, selected, cellStr } = this.state;
    const values =
      sort === -1
        ? [...data.values]
        : [...data.values].sort((a, b) => a[sort] - b[sort]);
    const sortedData = { columns: data.columns, values };

    return (
      <Paper className={classes.root}>
        <div className={classes.header}>
          <DatasetSelector {...this.props} />
          {editable && <RefreshDataset {...this.props} />}
        </div>
        <div className={classes.header}>n: {sortedData.values.length}</div>
        <div className={classes.table}>
          <Table>
            <TableHeader
              columns={data.columns}
              sortBy={i => this.setState({ sort: i })}
              {...this.props}
            />
            <TableBody>
              {sortedData.values.map((entry, index) => {
                const tmp = '' + index;
                return (
                  <TableRow key={tmp}>
                    {entry.map((v, i2) => {
                      const tmp2 = tmp + i2;
                      return (
                        <TableCell
                          key={tmp2}
                          onClick={() => {
                            if (editable)
                              this.setState({
                                selected: [index, i2],
                                cellStr: v
                              });
                          }}
                        >
                          {index === selected[0] && i2 === selected[1] ? (
                            <input
                              ref={ref => (this.el = ref)}
                              type="text"
                              value={cellStr}
                              onChange={e =>
                                this.setState({ cellStr: e.target.value })
                              }
                              style={{ padding: '3px' }}
                              onKeyPress={e => {
                                if (e.key === 'Enter' && this.el) {
                                  this.el.blur();
                                }
                              }}
                              onBlur={() => {
                                const newEntry = [...entry];
                                newEntry[i2] = cellStr;
                                dataFn.listReplace(entry, newEntry, [
                                  dataset,
                                  'values',
                                  index
                                ]);
                                logger({
                                  type: 'edited value',
                                  itemId: dataset,
                                  payload: { old: entry, new: newEntry }
                                });
                                this.setState({
                                  selected: [-1, -1],
                                  cellStr: ''
                                });
                              }}
                            />
                          ) : (
                            displayEntry(v)
                          )}
                        </TableCell>
                      );
                    })}
                    {editable && (
                      <DeleteElementCell {...this.props} entry={entry} />
                    )}
                  </TableRow>
                );
              })}
              {editable && <AddElementRow {...this.props} />}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(Data);
