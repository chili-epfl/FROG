// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import { every } from 'lodash';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import Route from './FROGRoute';

import Body from './Body.jsx';

const DEFAULT_PASSWORD = '123456';
const connectWithDefaultPwd = username =>
  Meteor.loginWithPassword(username, DEFAULT_PASSWORD);

const socket = new ReconnectingWebSocket('ws://localhost:3002');
export const connection = new sharedbClient.Connection(socket);
window.connection = connection;

export default () =>
  <Router>
    <Route component={FROGRouter} />
  </Router>;

// class Page extends Component {
//   state = {
//     currentApp: 'home'
//   };

//   render() {
//     if (!this.props.ready)
//       return <div id="app" style={{ backgroundColor: 'white' }} />;
//     return (
//       <div id="app">
//         <Router>
//           <div>
//             {this.props.username === 'teacher' &&
//               <ul className="nav nav-pills">
//                 {Object.keys(apps).map(app =>
//                   <li
//                     key={app}
//                     role="presentation"
//                     className={
//                       app.toString().split(' ')[0].toLowerCase() ===
//                       this.state.currentApp
//                         ? 'active'
//                         : ''
//                     }
//                   >
//                     <NavLink
//                       to={
//                         '/' +
//                         this.props.username +
//                         '/' +
//                         app.toString().split(' ')[0].toLowerCase()
//                       }
//                       onClick={() => {
//                         this.setState({
//                           currentApp: app.toString().split(' ')[0].toLowerCase()
//                         });
//                       }}
//                     >
//                       {apps[app]}
//                     </NavLink>
//                   </li>
//                 )}
//               </ul>}
//             <div id="body">
//               <Route
//                 path={'/' + this.props.username + '/:app'}
//                 component={Body}
//               />
//             </div>
//           </div>
//         </Router>
//       </div>
//     );
//   }
// }
