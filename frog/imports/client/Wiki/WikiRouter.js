// @flow

import * as React from 'react';
import {
    Route,
    Switch,
  } from 'react-router-dom';
import Wiki from './index';
import Index from './WikiIndex';

export default function WikiRouter() {
      return (
          <Switch>
              <Route path="/wiki" exact component={Index} />
              <Route
                path="/wiki/:wikiId/:pageTitle/:instance"
                component={Wiki}
              />
              <Route path="/wiki/:wikiId/:pageTitle" component={Wiki} />
              <Route path="/wiki/:wikiId" component={Wiki} />
          </Switch>
      );
  };