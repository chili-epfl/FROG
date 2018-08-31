// @flow

import * as React from 'react';
import humanFormat from 'human-format';

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

import FilteringPanel from './FilteringPanel';

const styles = () => ({
  root: {
    maxWidth: '25%',
    height: '550px',
    overflowY: 'scroll'
  },
  table: {
    border: 'solid 1px'
  },
  head1: {
    fontSize: 'large',
    backgroundColor: '#CCC',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    cursor: 'pointer'
  },
  head2: {
    fontSize: 'large',
    backgroundColor: '#CCC',
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  body: {
    maxHeight: '500px',
    overflowY: 'scroll'
  }
});

const AddElementRow = ({ data, dataFn, dataset }) => (
  <TableRow>
    <TableCell>
      <IconButton
        onClick={() => {
          dataFn.listAppend(data.columns.map(() => ''), [dataset, 'values']);
        }}
      >
        <Add />
      </IconButton>
    </TableCell>
  </TableRow>
);

const DeleteElementCell = ({ dataFn, entry, dataset, index }) => (
  <TableCell>
    <IconButton
      onClick={() => dataFn.listDel(entry, [dataset, 'values', index])}
    >
      <Remove />
    </IconButton>
  </TableCell>
);

class Data extends React.Component<*, *> {
  el: any;

  state = {
    selected: [-1, -1],
    cellStr: '',
    sort: -1
  };

  render() {
    const {
      classes,
      data,
      dataFn,
      dataset,
      originalData,
      transformation,
      setTransformation,
      editable
    } = this.props;

    const { sort, selected, cellStr } = this.state;

    console.log(data.values);
    console.log(sort);
    const sortedData =
      sort === -1
        ? data
        : {
            columns: data.columns,
            values: [...data.values].sort((a, b) => a[sort] > b[sort])
          };
    console.log(sortedData.values);
    // do not sort correctly some data

    if (!data || !data.columns) {
      return <p>no data</p>;
    }

    return (
      <Paper className={classes.root}>
        <FilteringPanel
          {...{
            data,
            setTransformation,
            transformation
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h3>Data</h3>
          <IconButton
            onClick={() => {
              dataFn.objReplace(data, originalData[dataset], dataset);
              setTransformation('');
            }}
          >
            <Replay />
          </IconButton>
        </div>
        {
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {data.columns.map((axis, i) => (
                  <TableCell
                    className={classes.head1}
                    key={axis}
                    onClick={() => this.setState({ sort: i })}
                  >
                    {axis}
                  </TableCell>
                ))}
                {editable && (
                  <TableCell className={classes.head2}>Action</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody className={classes.body}>
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
                              type="number"
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
                                this.setState({
                                  selected: [-1, -1],
                                  cellStr: ''
                                });
                              }}
                            />
                          ) : typeof v === 'number' ? (
                            v
                          ) : (
                            humanFormat(v)
                          )}
                        </TableCell>
                      );
                    })}
                    {editable && (
                      <DeleteElementCell
                        {...{ dataFn, entry, dataset, index }}
                      />
                    )}
                  </TableRow>
                );
              })}
              {editable && (
                <AddElementRow data={data} dataFn={dataFn} dataset={dataset} />
              )}
            </TableBody>
          </Table>
        }
      </Paper>
    );
  }
}

export default withStyles(styles)(Data);
