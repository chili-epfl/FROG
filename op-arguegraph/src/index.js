import memoize from 'memoizejs'

// from http://stackoverflow.com/questions/21295162/javascript-randomly-pair-items-from-array-without-repeats
const splitAt = (i, xs) => {
  const a = xs.slice(0, i)
  const b = xs.slice(i, xs.length)
  return [a, b]
}

const shuffle = (xs) => 
  xs.slice(0).sort(() => 
    .5 - Math.random()
  )

// note takes a single array composed of two arrays
const zip = (xs) => 
  xs[0].map((_, i) => 
    xs.map(x => x[i])
  )

// Obviously assumes even array
const randomPairs = (list) => zip(splitAt(list.length/2, shuffle(list)))
const makePairs = (list) => zip(splitAt(list.length/2, list))


// get distance between two point objects {x,y} and {x,y}
const getDist = memoize((point1, point2) => {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
})

export const config = {
  title: 'Configuration for ArgueGraph',
  type: 'object',
  properties: {
    'weighting': {
      type: 'string',
      title: 'Weighting'
    },
    'maxmin': {
      type: 'string',
      enum: [
        'maximum',
        'minimum'
      ]
    }
  }
}

export const operator = () => null
export default {operator: operator, config: config}
