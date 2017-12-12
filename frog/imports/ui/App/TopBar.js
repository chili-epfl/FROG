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
class TopBar extends React.Component {
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
                            <Tab label="Graph Editor" component={Link} to="/graph" />
                            <Tab label="Sessions" component={Link} to="/teacher" />
                            <Tab label="Preview" component={Link} to="/preview" />
                            <Tab label="Admin" component={Link} to="/admin" />
                        </Tabs>
                        <Button color="contrast"><AccountCircle/></Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default TopBar;