// @flow
import { get, set, isEmpty, omit } from 'lodash';

type rawPathT = string | string[];

const cleanPath = (defPath: rawPathT, rawPath: rawPathT = []): string[] => {
  const newPath = Array.isArray(rawPath) ? rawPath : [rawPath];
  const p = Array.isArray(defPath) ? defPath : [defPath];
  return [...p, ...newPath];
};

export class MemDoc {
  data: any;
  path: rawPathT;
  callback: Function;

  constructor(data: any, path?: rawPathT) {
    this.data = data;
    this.path = path || [];
    this.callback = () => {};
  }
  submitOp(path: rawPathT, op: Function) {
    const setpath = cleanPath(this.path, path);
    const toChange = isEmpty(path) ? this.data : get(this.data, setpath);
    const newVal = op(toChange);
    if (isEmpty(path)) {
      this.data = newVal;
    } else {
      set(this.data, setpath, newVal);
    }
    console.log('MAKE CALLBACK');
    console.log(this.data);
    this.callback();
  }
  listPrepend(newVal: any, path: rawPathT) {
    this.submitOp(path, x => [newVal, ...x]);
  }
  listAppend(newVal: any, path: rawPathT) {
    this.submitOp(path, x => [...x, newVal]);
  }
  listInsert(newVal: any, path: rawPathT) {
    const idx = path[path.length - 1];
    this.submitOp(path.slice(0, path.length - 1), x => [
      ...x.slice(0, idx),
      newVal,
      ...x.slice(idx)
    ]);
  }
  listDel(oldVal: any, path: rawPathT) {
    const idx = path[path.length - 1];
    this.submitOp(path.slice(0, path.length - 1), x => [
      ...x.slice(0, idx),
      ...x.slice(idx)
    ]);
  }
  listReplace(oldVal: any, newVal: any, path: rawPathT) {
    const idx = path[path.length - 1];
    this.submitOp(path.slice(0, path.length - 1), x => [
      ...x.slice(0, idx),
      newVal,
      ...x.slice(idx + 1)
    ]);
  }
  numIncr(incr: number, path: rawPathT) {
    this.submitOp(path, x => x + incr);
  }
  objInsert(newVal: Object, path: rawPathT) {
    this.submitOp(path, _ => newVal);
  }
  objDel(oldVal: Object, path: rawPathT) {
    const toDel = path[path.length - 1];
    this.submitOp(path.slice(0, path.length - 1), x => omit(x, toDel));
  }

  specialize(rawPath: rawPathT) {
    const newPath = typeof rawPath === 'string' ? [rawPath] : rawPath;
    return new MemDoc(this.data, [...this.path, ...newPath]);
  }
  specializeData(path: rawPathT, data: Object) {
    if (typeof path === 'string') {
      return data[[path]];
    }
    return path.reduce((acc, x) => acc[[x]], data);
  }

  setMaxListeners = () => {};

  removeListener = () => {
    this.callback = () => {};
  };

  subscribe = () => {};

  destroy = () => {
    this.callback = () => {};
  };

  on = (type: string, callback: Function) => {
    if (type === 'op') {
      this.callback = callback;
    }
    if (type === 'load') {
      callback();
    }
  };
}

export const inMemoryReactive = (initial: any) => {
  const memDoc = new MemDoc(initial);
  return [memDoc, memDoc];
};
