// @flow
import { get, set, isEmpty, omit } from 'lodash';

type rawPathT = string | string[];

const cleanPath = (defPath: string[], rawPath: rawPathT = []): string[] => {
  const newPath = Array.isArray(rawPath) ? rawPath : [rawPath];
  return [...defPath, ...newPath];
};

export class MemDoc {
  doc: any;
  path: rawPathT;

  constructor(doc: any, path?: rawPathT) {
    this.doc = doc;
    this.path = path || [];
  }

  submitOp(path: rawPathT, op: Function) {
    const setpath = cleanPath(this.path, path);
    const toChange = isEmpty(path) ? this.doc : get(this.doc, setpath);
    const newVal = op(toChange);
    if (isEmpty(path)) {
      this.doc = newVal;
    } else {
      set(this.doc, setpath, newVal);
    }
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
    const setpath = cleanPath(this.path, path);
    set(this.doc, setpath, newVal);
  }
  objDel(oldVal: Object, path: rawPathT) {
    const toDel = path[path.length - 1];
    this.submitOp(path.slice(0, path.length - 1), x => omit(x, toDel));
  }
  specialize(rawPath: rawPathT) {
    const newPath = typeof rawPath === 'string' ? [rawPath] : rawPath;
    return new Doc(this.doc, [...this.path, ...newPath], this.readOnly);
  }

  specializeData(path: rawPathT, data: Object) {
    if (typeof path === 'string') {
      return data[[path]];
    }
    return path.reduce((acc, x) => acc[[x]], data);
  }
}

export const inMemoryReactive = (initial: any) => ({
  data: initial,
  dataFn: new MemDoc(initial)
});
