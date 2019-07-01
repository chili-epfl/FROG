// @flow

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import WikiWrapper from './WikiWrapper';
import Index from './WikiIndex';

export default function WikiRouter() {
  return (
    <Switch>
      <Route path="/wiki" exact component={Index} />
      <Route
        path="/wiki/:wikiId/:pageTitle/:instance"
        component={WikiWrapper}
      />
      <Route path="/wiki/:wikiId/:pageTitle" component={WikiWrapper} />
      <Route path="/wiki/:wikiId" component={WikiWrapper} />
    </Switch>
  );
}
