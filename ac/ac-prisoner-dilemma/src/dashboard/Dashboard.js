/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { type ActivityDbT, entries, values } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
    root: {
        margin: "20px",
    },
    table: {
        tableLayout: "fixed",
    },
    statsRow: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: "17px",
        textAlign: "center"
    },
    cell: {
        fontSize: "17px",
    },
});

const reactiveToDisplay = (reactive: Object, activity: ActivityDbT) => {

    const totalRounds = activity.data.rounds;
    const games = Object.keys(reactive);

    const formattedData = games.map(game => {
        const students = Object.keys(reactive[game]["students"])
            .sort()
            .splice(0, 2);

        return students.map(student => {
            const id = student;
            const name = reactive[game]["students"][student].name;
            const score = reactive[game]["students"][student].score;
            const rounds = reactive[game].rounds;

            const actions = [];
            for (let i = 0; i < totalRounds; i++) {
                const element = rounds[i] !== undefined && rounds[i][id] !== undefined ?
                    (rounds[i][id] ? "Cooperate" : "Cheat" ) :
                    "";
                actions.push(element);
            }

            return {id, name, score, actions}
        });
    });

    const scores = [];
    formattedData.forEach(game => {
        scores.push(game[0].score);
        scores.push(game[1].score);
    });

    const max = Math.max.apply(null, scores);
    const min = Math.min.apply(null, scores);
    const avg = scores.reduce((a, b) => a + b) / scores.length;
    const stats = {avg, min, max};

    return {stats, formattedData};
};

const Viewer = withStyles(styles)(
    ({ state, classes }: { state: Array, classes: Object }) => {

        return (
            <div>
                <Paper className={classes.root} >
                    <Table className={classes.table} >
                        <TableBody>
                            <TableRow key="stats">
                                <TableCell component="th" scope="row" className={classes.statsRow}> Average: {state.stats.avg}</TableCell>
                                <TableCell className={classes.statsRow}> Lowest: {state.stats.min}</TableCell>
                                <TableCell className={classes.statsRow}> Highest: {state.stats.max}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>

                {state.formattedData.map(rows => {
                    return (
                        <Paper className={classes.root} >
                            <Table className={classes.table} >
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.id} >
                                            <TableCell component="th" scope="row" className={classes.cell}>{row.name}</TableCell>
                                            <TableCell className={classes.cell}>{row.score}</TableCell>
                                            {row.actions.map(cell => <TableCell className={classes.cell}>{cell}</TableCell>)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    );
                })}
            </div>
        );
});

export default {
    Viewer,
    reactiveToDisplay,
    initData: []
};
