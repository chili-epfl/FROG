// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import dashboardText from './DashboardText';
import liType from './liType';

const meta = {
  name: 'Words selection',
  shortDesc: 'Reading a text and selecting some words in the text',
  description:
    'Allow the student to select words that are highlighted int the text displayed.',
  exampleData: [
    {
      title: 'Lorem Ipsum',
      config: {
        title: 'Lorem Ipsum',
        text:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n Why do we use it?\n It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\n\n Where does it come from?\n Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32."
      },
      activityData: {}
    },
    {
      title: 'Where is the love (Black Eyed Peas)',
      config: {
        title: 'Where is the love (Black Eyed Peas)',
        text: `People killin' people dyin'
Children hurtin', I hear them cryin'
Can you practice what you preachin'?
Would you turn the other cheek again?
Mama, mama, mama, tell us what the hell is goin' on
Can't we all just get along?
Father, father, father help us
Send some guidance from above
'Cause people got me, got me
Questioning

Yo what's going on with the world, momma
Yo people living like they ain't got no mommas
I think they all distracted by the drama and
Attracted to the trauma, mamma
I think they don't understand the concept or
The meaning of karma

Overseas, yeah they trying to stop terrorism
Over here on the streets the police shoot
The people put the bullets in 'em
But if you only got love for your own race
Then you're gonna leave space for others to discriminate

And to discriminate only generates hate
And when you hate then you're bound to get irate
Madness is what you demonstrate
And that's exactly how hate works and operates
Man, we gotta set it straight
Take control of your mind and just meditate
And let your soul just gravitate
To the love, so the whole world celebrate it

People killin' people dyin' …

It just ain't the same, always in change
New days are strange, is the world insane?
Nation droppin' bombs killing our little ones
Ongoing suffering as the youth die young

Where's the love when a child gets murdered
Or a cop gets knocked down
Black lives not now
Everybody matter to me
All races, y'all don't like what I'm sayin'? Haterade, tall cases
Everybody hate somebody
Guess we all racist
Black Eyed Peas do a song about love and y'all hate this
All these protests with different colored faces
We was all born with a heart
Why we gotta chase it?
And every time I look around

Every time I look up, every time I look down
No one's on a common ground
And if you never speak truth then you never know how love sounds
And if you never know love then you never know God, wow
Where's the love y'all? I don't, I don't know
Where's the truth y'all? I don't know

People killin' people dyin' …

Love is the key
Love is the answer
Love is the solution
They don't want us to love
Love is powerful

My mama asked me why I never vote never vote
'Cause police men want me dead and gone (Dead and gone)
That election looking like a joke (Such a joke)
And the weed man still sellin' dope
Somebody gotta give these niggas hope (Please hope)
All he ever wanted was a smoke (My gosh)
Said he can't breathe with his hands in the air
Layin' on the ground died from a choke

I feel the weight of the world on my shoulders
As I'm gettin' older y'all people gets colder
Most of us only care about money makin'
Selfishness got us followin' the wrong direction
Wrong information always shown by the media
Negative images is the main criteria
Infecting the young minds faster than bacteria
Kids wanna act like what they see in the cinemas
What happened to the love and the values of humanity?
What happened to the love and the fairness and equality?
(Instead of spreading love we're spreading animosity
Lack of understanding leading us away from unity`
      },
      activityData: {}
    }
  ]
};

const ColorOptions = [
  ['#FFFFFF', 'White'],
  ['#FFFF00', 'Yellow'],
  ['#FF0000', 'Red'],
  ['#0000FF', 'Blue'],
  ['#32CD32', 'Green']
];

const translateColor = hex => ColorOptions.find(x => x[0] === hex)?.[1];

const formatProduct = (_, product, instanceId, user) => {
  if (product.highlighted) {
    return Object.keys(product.highlighted).reduce((acc, x) => {
      const id = uuid();
      return {
        ...acc,
        [id]: {
          id,
          category: translateColor(product.highlighted[x].color),
          user,
          li: {
            liDocument: {
              liType: 'li-wordSelect',
              createdAt: new Date(),
              createdByUser: instanceId,
              createdBy: 'ac-select',
              payload: { word: x, color: product.highlighted[x].color }
            }
          }
        }
      };
    }, {});
  } else {
    return {};
  }
};

const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    text: {
      type: 'string',
      title: 'Text'
    },
    multi: {
      type: 'boolean',
      title: 'Color each highlighted word differently'
    },
    chooseColor: {
      type: 'boolean',
      title: 'Let students choose which color to use for highlighting'
    }
  }
};

const configUI = {
  text: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5
    }
  },
  multi: { conditional: formData => !formData.chooseColor },
  chooseColor: { conditional: formData => !formData.multi }
};

const dataStructure = { highlighted: {}, currentColor: '#FFFF00' };

export default ({
  id: 'ac-select',
  type: 'react-component',
  configVersion: 1,
  dataStructure,
  meta,
  config,
  configUI,
  formatProduct,
  dashboards: { Dashboard: dashboardText },
  LearningItems: [liType]
}: ActivityPackageT);
