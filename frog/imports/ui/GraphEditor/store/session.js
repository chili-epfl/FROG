// @flow

import { observable, computed, action } from 'mobx';
import { store } from './index';

export default class Session {
  constructor(session) {
    if (session) {
      this.id = session._id;
      this.setTimes(session);
      this.interval = setInterval(this.incrTimeShouldBe, 6000);
    }
  }

  @observable id: String = '';
  @observable timeShouldBe: Number = 0;
  @observable timeIs: Number = 0;

  @action setTimes = (session: Object): void => {
    this.updateTimeIs(session.timeInGraph);
    console.log((Date.now() - session.startedAt) / 6e4);
    this.updateTimeShouldBe((Date.now() - session.startedAt) / 6e4);
  };

  @action updateTimeIs = (newTime: Number): void => {
    this.timeIs = newTime;
  };

  @action updateTimeShouldBe = (newTime: Number): void => {
    this.timeShouldBe = newTime;
  };

  @action incrTimeShouldBe = (incr: Number = 0.1): void => {
    this.timeShouldBe += incr;
  };

  close = () => {
    clearInterval(this.inverval);
  };
}
