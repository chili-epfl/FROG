// @flow
import * as React from 'react';
import ShareDB from 'sharedb';
import StringBinding from 'sharedb-string-binding';
import { get } from 'lodash';

import { uuid } from './index';
import type { LearningItemComponentT } from './types';

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
  LearningItemFn: LearningItemComponentT;
  meta: Object;
  backend: any;
  path: rawPathElement[];

  constructor(
    doc: any,
    path?: rawPathElement[],
    readOnly: boolean,
    updateFn?: Function,
    meta: Object = {},
    LearningItem: LearningItemComponentT,
    backend: any
  ) {
    this.backend = backend;
    this.meta = meta;
    this.readOnly = !!readOnly;
    this.doc = doc;
    this.path = path || [];
    this.submitOp = readOnly
      ? () => updateFn && updateFn()
      : e => {
          doc.submitOp(e);
        };
    this.updateFn = updateFn;
    this.LearningItemFn = LearningItem;
  }

  createLearningItem(liType: string, payload?: Object, meta?: Object): string {
    const id = uuid();
    const itempointer = this.doc.connection.get('li', id);
    itempointer.create({
      liType,
      payload,
      createdAt: new Date(),
      ...meta,
      ...this.meta
    });
    itempointer.subscribe();
    return id;
  }

  LearningItem = (props: any) => {
    const LI = this.LearningItemFn;
    return <LI {...props} dataFn={this} />;
  };

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
  listAppendLI(liType: string, payload: Object, meta: Object, path: rawPathT) {
    const liID = this.createLearningItem(liType, payload, meta);
    this.submitOp({
      p: [...cleanPath(this.path, path), 999999],
      li: liID
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
      this.LearningItemFn,
      this.backend
    );
  }

  specializeData(path: rawPathT, data: Object) {
    if (typeof path === 'string' || typeof path === 'number') {
      return data[[path]];
    }
    return path.reduce((acc, x) => acc[[x]], data);
  }
}

export const generateReactiveFn = (
  doc: any,
  LearningItem: any,
  meta?: Object,
  readOnly?: boolean,
  updateFn?: Function,
  backend?: any
): Object => {
  if (doc) {
    return new Doc(doc, [], !!readOnly, updateFn, meta, LearningItem, backend);
  } else {
    throw 'Cannot create dataFn without sharedb doc';
  }
};

export const inMemoryReactive = (
  initial: any,
  LearningItem: any,
  backend: any
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
  }).then(doc => ({
    data: doc,
    dataFn: new Doc(doc, [], false, undefined, undefined, LearningItem, backend)
  }));
};
