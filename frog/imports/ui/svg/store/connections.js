// @flow
import { computed, action, observable } from 'mobx';
import { store } from './store'
import Connection from './connection'

export default class ConnectionStore {
  @observable all: Array<Connection> = [];

  @action mongoAdd= x => {
    if (!this.findId({ type: 'connection', id: x._id })) {
      this.connections.push(new Connection(
        this.findId(x.source),
        this.findId(x.target),
        x._id
      ));
    }
  };
  @action mongoRemove= remact => {
    this.connections = this.connections.filter(x => x.id !== remact._id);
  };


  @computed get mongoObservers() {
    return ({
      added: this.mongoAdd,
      removed: this.mongoRemove
    })
  }

  @computed get history(): Array<any> {
    return this.all.map(x => ({...x}))
  }
}
