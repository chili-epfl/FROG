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
  head: {
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

class Data extends React.Component<*, *> {
  state = {
    selected: [-1, -1],
    cellStr: ''
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
                {data &&
                  data[0] &&
                  Object.keys(data[0]).map(axis => (
                    <TableCell className={classes.head} key={axis}>
                      {axis}
                    </TableCell>
                  ))}
                {editable && (
                  <TableCell className={classes.head}>Action</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody className={classes.body}>
              {data &&
                data.map((entry, index) => {
                  const tmp = '' + index;
                  return (
                    <TableRow key={tmp}>
                      {Object.values(entry).map((v, i2) => {
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
                            className={classes.cell}
                          >
                            {index === this.state.selected[0] &&
                            i2 === this.state.selected[1] ? (
                              <input
                                type="text"
                                value={this.state.cellStr}
                                onChange={e =>
                                  this.setState({ cellStr: e.target.value })
                                }
                                style={{ padding: '5px' }}
                                onKeyPress={e => {
                                  if (e.key === 'Enter') {
                                    const newEntry = { ...entry };
                                    newEntry[
                                      Object.keys(entry)[i2]
                                    ] = this.state.cellStr;
                                    dataFn.listReplace(entry, newEntry, [
                                      dataset,
                                      index
                                    ]);
                                    this.setState({
                                      selected: [-1, -1],
                                      cellStr: ''
                                    });
                                    e.preventDefault();
                                  }
                                }}
                                onBlur={() => {
                                  const newEntry = { ...entry };
                                  newEntry[
                                    Object.keys(entry)[i2]
                                  ] = this.state.cellStr;
                                  dataFn.listReplace(entry, newEntry, [
                                    dataset,
                                    index
                                  ]);
                                  this.setState({
                                    selected: [-1, -1],
                                    cellStr: ''
                                  });
                                }}
                              />
                            ) : (
                              v
                            )}
                          </TableCell>
                        );
                      })}
                      {editable && (
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              dataFn.listDel(entry, [dataset, index])
                            }
                          >
                            <Remove />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              {editable && (
                <TableRow>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        const newEntry = {};
                        Object.keys(originalData[dataset][0]).forEach(
                          e => (newEntry[e] = '')
                        );
                        dataFn.listAppend(newEntry, dataset);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        }
      </Paper>
    );
  }
}

export default withStyles(styles)(Data);
