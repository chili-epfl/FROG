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

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.state = {value: "/graph"};
    }

    handleChange = (event, value) => {
        this.setState({value});
        console.log('called state', value);
    };

    render() {
        const {classes} = this.props;

        console.log('props', this.props, this.state);
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <Typography type="subheading" color="inherit">
                            CK : Teacher
                        </Typography>
                        <Tabs className={classes.tabs}  value={this.state.value} onChange={this.handleChange} fullWidth>
                            <Tab label="Sessions" component={Link} to="/teacher" value="/teacher"/>
                            <Tab label="Graph Editor" component={Link} to="/graph" value="/graph"/>
                            <Tab label="Preview" component={Link} to="/preview" value="/preview"/>
                            <Tab label="Admin" component={Link} to="/admin" value="/admin"/>
                        </Tabs>
                        <Button color="contrast"><AccountCircle/></Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default TopBar;