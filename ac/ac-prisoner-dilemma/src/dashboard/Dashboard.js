/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { type ActivityDbT, entries, values } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// Styles

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

// Format data

const reactiveToDisplay = (reactive: Object, activity: ActivityDbT) => {

    // Helpers

    const createRow = (id, name, score, rounds) => {
        const totalRounds = activity.data.rounds;

        // Build list of actions
        const actions = [];
        for (let i = 0; i < totalRounds; i++) {
            const element = rounds[i] !== undefined && rounds[i][id] !== undefined ?
                (rounds[i][id] ? "Cooperate" : "Cheat" ) :
                "";
            actions.push(element);
        }

        return {id, name, score, actions}
    };

    const formatData = () => {
        const games = Object.keys(reactive);

        // Format the data as a list of list of row, each list of row represent a game
        return games.map(game => {
            // Get "active" students
            const students = Object.keys(reactive[game]["students"])
                .sort()
                .splice(0, 2);

            // Create game rows
            return students.map(student => createRow(
                student,
                reactive[game]["students"][student].name,
                reactive[game]["students"][student].score,
                reactive[game].rounds
            ))
        });
    };

    const computeStatistics = (data) => {
        const scores = [];
        data.forEach(game => {
            scores.push(game[0].score);
            scores.push(game[1].score);
        });

        // Compute statistic
        const max = Math.max.apply(null, scores);
        const min = Math.min.apply(null, scores);
        const avg = scores.reduce((a, b) => a + b) / scores.length;

        return {avg, min, max};
    };

    // Format data

    const formattedData = formatData();
    const stats = computeStatistics(formattedData);

    return {stats, formattedData};
};

// Viewer

const Viewer = withStyles(styles)(
    ({ state, classes }: { state: Array, classes: Object }) => {

        // Methods

        const renderStatistics = () => (
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
        );

        const renderGameTable = (rows) => (
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

        // Render

        return (
            <div>
                {renderStatistics()}
                {state.formattedData.map(game => renderGameTable(game))}
            </div>
        );
});

// Exports

export default {
    Viewer,
    reactiveToDisplay,
    initData: []
};
