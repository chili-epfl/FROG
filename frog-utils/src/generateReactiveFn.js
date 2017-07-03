// @flow
import ShareDB from 'sharedb';
import { uuid } from './index';

type rawPathT = string | string[];

const cleanPath = (defPath: string[], rawPath: rawPathT = []): string[] => {
  const newPath = Array.isArray(rawPath) ? rawPath : [rawPath];
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
    const aryPath = Array.isArray(path) ? path : [path];
    this.doc.submitOp({
      p: cleanPath(this.path, [...aryPath, id]),
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

export const generateReactiveFn = (doc: any): Object => {
  if (doc) {
    return new Doc(doc, []);
  } else {
    throw 'Cannot create dataFn without sharedb doc';
  }
};

export const inMemoryReactive = (
  initial: any
): Promise<{ data: any, dataFn: Doc }> => {
  const share = new ShareDB();
  const connection = share.connect();

  return new Promise(resolve => {
    const doc = connection.get('coll', uuid());
    doc.subscribe();
    doc.on('load', () => {
      doc.create(initial);
      resolve(doc);
    });
  }).then(doc => ({ data: doc, dataFn: new Doc(doc, []) }));
};
