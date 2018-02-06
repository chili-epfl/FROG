// @flow

import { extendObservable, observable, action } from 'mobx';

export default class Session {
  constructor(
    session: ?{
      _id: string,
      timeInGraph: number,
      startedAt: number
    }
  ) {
    extendObservable(this, {
      id: '',
      timeInClass: 0,
      timeInGraph: 0,

      startedAt: number,
      interval: IntervalID,

      setTimes: action((session: Object) => {
        this.updateTimeInGraph(session.timeInGraph);
        this.startedAt = session.startedAt;
        this.updateTimeInClass((Date.now() - this.startedAt) / 6e4);
      }),

      updateTimeInGraph: action((newTime: number) => {
        this.timeInGraph = newTime;
      }),

      updateTimeInClass: action((newTime: ?number) => {
        if (newTime && newTime > -1) {
          this.timeInClass = newTime;
        } else if (this.startedAt > -1) {
          this.timeInClass = (Date.now() - this.startedAt) / 6e4;
        } else {
          this.timeInClass = 0;
        }
      })
    });
  }

  if(session) {
    this.id = session._id;
    this.setTimes(session);
    this.interval = setInterval(this.updateTimeInClass, 6000);
  }

  close = () => {
    clearInterval(this.interval);
  };
}
