// archived code - we used to compress documents for read-only display. it caused
// some issues around bullet lists etc
//
// if (this.props.readOnly) {
//   const ops = cloneDeep(raw.ops);
//   if (!ops) {
//     return raw;
//   }
//   while (true) {
//     const [tail] = ops.slice(-1);
//     if (!tail) {
//       break;
//     }
//     if (typeof tail.insert !== 'string') {
//       break;
//     }
//     if (tail.insert.trim() !== '') {
//       break;
//     }
//     ops.pop();
//   }

//   const [tail1] = ops.slice(-1);
//   if (tail1) {
//     if (typeof tail1.insert === 'string') {
//       ops[ops.length - 1].insert = tail1.insert.trimEnd() + '\n';
//     }
//   }

//   while (true) {
//     const [hd] = ops.slice(0, 1);
//     if (!hd) {
//       break;
//     }
//     if (typeof hd.insert !== 'string') {
//       break;
//     }
//     if (hd.insert.trim() !== '') {
//       break;
//     }
//     ops.shift();
//   }

//   const [head1] = ops.slice(0, 1);
//   if (head1) {
//     if (typeof head1.insert === 'string') {
//       ops[0].insert = head1.insert.trimStart();
//     }
//   }
//   if (ops.slice(-1).insert !== '\n') {
//     ops.push({ insert: '\n' });
//   }
//   raw.ops = ops;
// }
