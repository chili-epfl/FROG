import { extendObservable, action } from 'mobx';

export default class Session {
  constructor(session) {
    console.log('constructor', session);
    extendObservable(this, {
      id: '',
      timeInClass: 0,
      timeInGraph: 0,

      startedAt: 0,
      interval: null,

      setTimes: action((_session: Object) => {
        console.log('setTimes');
        this.updateTimeInGraph(_session.timeInGraph);
        this.startedAt = _session.startedAt;
        this.updateTimeInClass((Date.now() - this.startedAt) / 6e4);
      }),

      updateTimeInGraph: action((newTime: number) => {
        console.log('update tig', newTime);
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

    if (session) {
      console.log('session', session.timeInGraph);
      this.id = session._id;
      this.setTimes(session);
      this.interval = setInterval(this.updateTimeInClass, 6000);
    }
  }

  close = () => {
    clearInterval(this.interval);
  };
}
