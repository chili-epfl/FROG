// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { listWikis } from './helpers';

type StateT = {
    list: string[]
}

class Index extends React.Component<null, StateT> {
    constructor() {
        super();
        this.state = {
            list: []
        };
    }

    componentWillMount() {
        listWikis().then(x => {
          this.setState({ list: x });
      });
    }

    render() {
        return (
            <List>
              {this.state.list.map(id => (
                <Link to={'/wiki/' + id} key={id}>
                  <ListItem button>
                    <ListItemText primary={id} />
                  </ListItem>
                </Link>
              ))}
            </List>
          );
    }
}
export default Index;