// @flow

import { uuid } from 'frog-utils';

type rawPathT = string | string []

const cleanPath = (defPath: [], rawPath: rawPathT = []): string[] => {
  const newPath = rawPath.constructor !== Array ? [rawPath] : rawPath;
  return [...defPath, ...newPath];
};

class Doc {
  doc: any;
  path: string[];

  constructor(doc: any, path: ?(string[])) {
    this.doc = doc;
    this.path = path || [];
  }
  listPrepend(newVal: any, path: rawPathT) {
    this.doc.submitOp({ p: [...cleanPath(this.path, path), 0], li: newVal });
  }
  listAppend(newVal: any, path: rawPathT) {
    this.doc.submitOp({
      p: [...cleanPath(this.path, path), 999999],
      li: newVal
    });
  }
  listInsert(newVal: any, path: rawPathT) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      li: newVal
    });
  }
  listDel(oldVal: any, path: rawPathT) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal
    });
  }
  listReplace(oldVal: any, newVal: any, path: rawPathT) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal,
      li: newVal
    });
  }
  numIncr(incr: number, path: rawPathT) {
    this.doc.submitOp({ p: cleanPath(this.path, path), na: incr });
  }
  objInsert(newVal: Object, path: rawPathT) {
    this.doc.submitOp({ p: cleanPath(this.path, path), oi: newVal });
  }
  keyedObjInsert(newVal: Object, path: rawPathT) {
    const id = uuid();
    this.doc.submitOp({
      p: cleanPath(this.path, [path, id]),
      oi: { id, ...newVal }
    });
  }
  objDel(oldVal: Object, path: rawPathT) {
    this.doc.submitOp({ p: cleanPath(this.path, path), od: oldVal });
  }
  objReplace(oldVal: Object, newVal: Object, path: rawPathT) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      od: oldVal,
      oi: newVal
    });
  }
  objSet(newVal: Object, path: rawPathT) {
    this.doc.submitOp({
      p: [...this.path, path],
      oi: newVal
    });
  }
  specialize(rawPath: rawPathT) {
    const newPath = typeof rawPath === 'string' ? [rawPath] : rawPath;
    return new Doc(this.doc, [...this.path, ...newPath]);
  }

  specializeData(path: rawPathT, data: Object) {
    if (typeof path === 'string') {
      return data[[path]];
    }
    return path.reduce((acc, x) => acc[[x]], data);
  }
}

export default (doc: any): Object => {
  if (doc) {
    return new Doc(doc, []);
  } else {
    throw 'Cannot create dataFn without sharedb doc';
  }
};
