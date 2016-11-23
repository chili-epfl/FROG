// deArray takes a list of multiple student products, like
// [{user_id: '3434', username: 'stian', data: [1, 2, 3]}]
// and "unrolls it" like this
// [{user_id: '3434', username: 'stian', data: 1}, {user_id: '3434', username: stian, data: 2}...]
const unroll = (acc, x) => { 
  if(Array.isArray(x.data)) { 
    return ([...acc, ...x.data.map(y => ({_id: x._id, username: x.username, data: y}) ) ])
  } else
  { 
    return ([...acc, x]) 
  }
}

export default (ary) => ary.reduce(unroll , [])

