import React from 'react';
import {NavLink, Link} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Tabs, {Tab} from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const ALink = ({to, children}) => (
    <Link
        to={to}
    >
        {children}
    </Link>
);


const TopBar = () => {
    const styles = {
        uber: {
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            fontFamily: 'Roboto'
        },
        appBar: {
            width: '100%',
        },
        tabBar: {
            width: "100%",
            flex: 1,
        },
        menuButton: {
            margin: '1em'
        },
        text: {
            flex: 1,
            fontSize: '1.5rem'
        },
    };
    return (
        <AppBar position="static" style={styles.appBar}>
            <Toolbar>
                <Typography type="title" color="inherit" style={styles.text}>
                    CK
                </Typography>

                <Tabs
                    styles={styles.tabBar}
                    fullWidth
                >
                    <Tab label="Teacher View"  value="/teacher"/>
                    <Tab label="Admin View" value="/admin"/>

                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

TopBar.displayName = 'TopBar';
export default TopBar;
