// @flow
import StringBinding from 'sharedb-string-binding';
import get from 'lodash/get';
import uuid from 'cuid';

type rawPathElement = string | number;
type rawPathT = rawPathElement | rawPathElement[];

const cleanPath = (
  defPath: rawPathElement[],
  rawPath: rawPathT = []
): rawPathElement[] => {
  const newPath = Array.isArray(rawPath) ? rawPath : [rawPath];
  return [...defPath, ...newPath];
};

export class Doc {
  doc: any;

  path: rawPathElement[];

  submitOp: Function;

  readOnly: boolean;

  updateFn: ?Function;

  meta: Object;

  backend: any;

  stream: ?Function;

  path: rawPathElement[];

  sessionId: string;

  uploadFn: Function;

  constructor(
    doc: any,
    path?: rawPathElement[],
    readOnly: boolean,
    updateFn?: Function,
    meta: Object = {},
    backend: any,
    stream?: Function,
    sessionId?: string
  ) {
    this.stream = stream;
    this.backend = backend;
    this.meta = meta;
    this.readOnly = !!readOnly;
    this.doc = doc;
    this.listore = {};
    this.path = path || [];
    this.sessionId = sessionId || '';
    this.submitOp = readOnly
      ? () => updateFn && updateFn()
      : e => {
          doc.submitOp(e);
        };
    this.updateFn = updateFn;
  }

  getMergedPath(path: rawPathT): * {
    return cleanPath(this.path, path);
  }

  getLearningTypesObj() {
    return {};
  }

  bindTextField(ref: any, rawpath: rawPathT) {
    const path = cleanPath(this.path, rawpath);
    if (typeof get(this.doc.data, path) !== 'string') {
      // eslint-disable-next-line no-console
      console.error(
        `Cannot use bindTextField on path that is not initialized as a string, path: ${JSON.stringify(
          path
        )}, value ${get(this.doc.data, path)}, doc.data: ${JSON.stringify(
          this.doc.data
        )}.`
      );
    }
    const binding = new StringBinding(ref, this.doc, path);
    binding.setup();
    return binding;
  }

  listPrepend(newVal: any, path: rawPathT) {
    this.submitOp({ p: [...cleanPath(this.path, path), 0], li: newVal });
  }

  listAppend(newVal: any, path: rawPathT) {
    this.submitOp({
      p: [...cleanPath(this.path, path), 999999],
      li: newVal
    });
  }

  listInsert(newVal: any, path: rawPathT) {
    this.submitOp({
      p: cleanPath(this.path, path),
      li: newVal
    });
  }

  listDel(oldVal: any, path: rawPathT) {
    this.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal
    });
  }

  listReplace(oldVal: any, newVal: any, path: rawPathT) {
    this.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal,
      li: newVal
    });
  }

  numIncr(incr: number, path: rawPathT) {
    this.doc.preventCompose = true;
    this.submitOp({ p: cleanPath(this.path, path), na: incr });
  }

  objInsert(newVal: any, path: rawPathT) {
    this.submitOp({ p: cleanPath(this.path, path), oi: newVal });
  }

  keyedObjInsert(newVal: Object, path: rawPathT) {
    const id = uuid();
    const aryPath = Array.isArray(path) ? path : [path];
    this.submitOp({
      p: cleanPath(this.path, [...aryPath, id]),
      oi: { id, ...newVal }
    });
  }

  objDel(oldVal: Object, path: rawPathT) {
    this.submitOp({ p: cleanPath(this.path, path), od: oldVal });
  }

  objReplace(oldVal: Object, newVal: Object, path: rawPathT) {
    this.submitOp({
      p: cleanPath(this.path, path),
      od: oldVal,
      oi: newVal
    });
  }

  objSet(newVal: Object, path: rawPathT) {
    this.submitOp({
      p: [...this.path, path],
      oi: newVal
    });
  }

  specialize(rawPath: rawPathT) {
    const newPath = Array.isArray(rawPath) ? rawPath : [rawPath];
    return new Doc(
      this.doc,
      [...this.path, ...newPath],
      this.readOnly,
      this.updateFn || (_ => {}),
      this.meta,
      this.backend
    );
  }

  specializeData(path: rawPathT, data: Object) {
    if (typeof path === 'string' || typeof path === 'number') {
      return data[[path]];
    }
    // $FlowFixMe
    return path.reduce((acc, x) => acc[[x]], data);
  }
}

export const generateReactiveFn = (
  doc: any,
  meta?: Object,
  readOnly?: boolean,
  updateFn?: Function,
  backend?: any,
  stream?: Function,
  sessionId?: string
): Object =>
  new Doc(doc, [], !!readOnly, updateFn, meta, backend, stream, sessionId);
