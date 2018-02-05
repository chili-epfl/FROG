// @flow

import { observable, action } from 'mobx';

export default class Session {
  constructor(
    session: ?{
      _id: string,
      timeInGraph: number,
      startedAt: number
    }
  ) {
    this.id = '';
    this.timeInClass = 0;
    this.timeInGraph = 0;
    if (session) {
      this.id = session._id;
      this.setTimes(session);
      this.interval = setInterval(this.updateTimeInClass, 6000);
    }
  }

  @observable id: string;
  @observable timeInClass: number;
  @observable timeInGraph: number;
  @observable startedAt: number;
  interval: IntervalID;

  @action
  setTimes(session: Object): void {
    this.updateTimeInGraph(session.timeInGraph);
    this.startedAt = session.startedAt;
    this.updateTimeInClass((Date.now() - this.startedAt) / 6e4);
  }

  @action
  updateTimeInGraph(newTime: number): void {
    this.timeInGraph = newTime;
  }

  @action
  updateTimeInClass(newTime: ?number): void {
    if (newTime && newTime > -1) {
      this.timeInClass = newTime;
    } else if (this.startedAt > -1) {
      this.timeInClass = (Date.now() - this.startedAt) / 6e4;
    } else {
      this.timeInClass = 0;
    }
  }

  close = () => {
    clearInterval(this.interval);
  };
}
