import React from 'react';
import {NavLink, Link} from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Tabs, {Tab} from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import AccountCircle from 'material-ui-icons/AccountCircle';

const ALink = ({to, children}) => (
    <Link
        to={to}
    >
        {children}
    </Link>
);

const topBarStyles = {
    uber: {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        fontFamily: 'Roboto'
    },
    tabBar: {
        width: "100%",
        flex: 1,
    },
    text: {
        flex: 1,
        fontSize: '1.5rem'
    },
    menuButton: {
        margin: '1em'
    },
};
const TopBar = () => {

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography type="title" color="inherit" style={topBarStyles.text}>
                    CK:Teacher
                </Typography>

                <Tabs
                    styles={topBarStyles.tabBar}
                    fullWidth
                >
                    <Tab label="Teacher View" value="/teacher"/>
                    <Tab label="Admin View" value="/admin"/>

                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

TopBar.displayName = 'TopBar';
export default TopBar;
const styles = theme => ({
    root: {
        flexGrow: 1,

        // marginTop: theme.spacing.unit * 3,
        backgroundColor: theme.palette.background.paper,
    },
    toolbar: {
        minHeight: '48px',
    },
    tabs: {
        flexGrow: 1,
    },
});

@withStyles(styles)
export class BasicTabs extends React.Component {
    state = {
        value: 0,
    };
    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {classes} = this.props;
        const {value} = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <Typography type="subheading" color="inherit">
                            CK : Teacher
                        </Typography>
                        <Tabs className={classes.tabs} value={value} onChange={this.handleChange} fullWidth>
                            <Tab label="Graph Editor"/>
                            <Tab label="Sessions"/>
                            <Tab label="Preview"/>
                            <Tab label="Admin"/>
                        </Tabs>
                        <Button color="contrast"><AccountCircle /></Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}