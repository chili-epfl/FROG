const cleanPath = (defPath, newPath = []) => {
  if (newPath.constructor !== Array) {
    newPath = [newPath];
  }
  return [...defPath, ...newPath];
};

class Doc {
  constructor(doc, path) {
    this.doc = doc;
    this.path = path || [];
  }
  listPrepend(newVal, path) {
    this.doc.submitOp({ p: [...cleanPath(this.path, path), 0], li: newVal });
  }
  listAppend(newVal, path) {
    this.doc.submitOp({
      p: [...cleanPath(this.path, path), 999999],
      li: newVal
    });
  }
  listInsert(newVal, path) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      li: newVal
    });
  }
  listDel(oldVal, path) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal
    });
  }
  listReplace(oldVal, newVal, path) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal,
      li: newVal
    });
  }
  numIncr(incr, path) {
    this.doc.submitOp({ p: cleanPath(this.path, path), na: incr });
  }
  objInsert(newVal, path) {
    this.doc.submitOp({ p: cleanPath(this.path, path), oi: newVal });
  }
  objDel(oldVal, path) {
    this.doc.submitOp({ p: cleanPath(this.path, path), od: oldVal });
  }
  objReplace(oldVal, newVal, path) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      od: oldVal,
      oi: newVal
    });
  }
  objSet(newVal, path) {
    this.doc.submitOp({
      p: [...this.path, path],
      oi: newVal
    });
  }
  specialize(path) {
    if (path.constructor !== Array) {
      path = [path];
    }
    return new Doc(this.doc, [...this.path, ...path]);
  }

  specializeData(path, data) {
    if (path.constructor !== Array) {
      return data[[path]];
    }
    return path.reduce((acc, x) => acc[[x]], data);
  }
}

export default doc => {
  if (doc) {
    return new Doc(doc, []);
  }
};
