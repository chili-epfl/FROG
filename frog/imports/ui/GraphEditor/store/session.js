// @flow

import { observable, computed, action } from 'mobx';
import { store } from './index';

export default class Session {
  constructor(session) {
    if (session) {
      this.id = session._id;
      this.setTimes(session);
      this.interval = setInterval(this.updateTimeShouldBe, 6000);
    }
  }

  @observable id: string = '';
  @observable timeShouldBe: number = 0;
  @observable timeIs: number = 0;
  @observable startedAt: number = null;

  @action setTimes = (session: Object): void => {
    this.updateTimeIs(session.timeInGraph);
    this.startedAt = session.startedAt
    this.updateTimeShouldBe((Date.now() - this.startedAt) / 6e4);
  };

  @action updateTimeIs = (newTime: number): void => {
    this.timeIs = newTime;
  };

  @action updateTimeShouldBe = (newTime: number): void => {
    if(newTime > -1) {
      this.timeShouldBe = newTime
    }else if(this.startedAt > -1){
      this.timeShouldBe = (Date.now() - this.startedAt) / 6e4
    } else {
      this.timeShouldBe = 0
    }
  };

  close = () => {
    clearInterval(this.inverval);
  };
}
