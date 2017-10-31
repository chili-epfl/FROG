// @flow

import { getActivitySequence } from '../graphSequence';

test('works', () => {
  expect(getActivitySequence(activities)).toEqual({
    cj95f3r3100hq07rsu6qx997j: 2,
    cj95f3r3100hr07rstxmn21ib: 3,
    cj95f3r3100hs07rs1o3bxb7d: 3,
    cj95f3r3100ht07rsvik6wp8h: 6,
    cj95f3r3100hu07rsqbkye5js: 6,
    cj95f3r3100hv07rsn01tip71: 5,
    cj95f3r3100hw07rsl9e31r2k: 1,
    cj95f3r3100hx07rsqd8f725x: 4,
    cj95f3r3100hy07rseokqlukb: 4
  });
});

const activities: Object[] = [
  {
    _id: 'cj95f3r3100hq07rsu6qx997j',
    title: 'Upload Images',
    startTime: 1,
    length: 5,
    plane: 1,
    activityType: 'ac-image',
    data: {
      guidelines:
        "Téléchargez des images de vos représentations. Pour chaque image, commentez votre réflexion et votre conclusion en expliquant comment votre représentation vous a aidé à résoudre le problème. Pour ce faire, cliquez sur l’image et écrivez dans le champ de texte. Les images que vous téléchargez seront classifiées, puis distribuées à d'autres groupes pour l'activité suivante.",
      canUpload: true,
      canComment: true,
      commentGuidelines: 'Veuillez commenter cette représentation',
      images: []
    },
    streamTarget: 'cj95f3r3100hr07rstxmn21ib'
  },
  {
    _id: 'cj95f3r3100hr07rstxmn21ib',
    title: 'Classifier',
    startTime: 1,
    length: 10,
    plane: 3,
    activityType: 'ac-classifier',
    data: {
      title: "Let's run KNN! (Kshitij Neural Network)",
      images: [],
      categories: ['diagram', 'table', 'tree', 'trash']
    },
    streamTarget: null
  },
  {
    _id: 'cj95f3r3100hs07rs1o3bxb7d',
    title: 'Create groups',
    startTime: 6,
    length: 5,
    plane: 3,
    activityType: 'ac-prox',
    streamTarget: null
  },
  {
    _id: 'cj95f3r3100ht07rsvik6wp8h',
    title: 'Upload photo',
    startTime: 25,
    length: 10,
    plane: 1,
    activityType: 'ac-image',
    data: {
      guidelines: 'Vous pouvez télécharger une photo de vos notes pour le quiz',
      canUpload: true,
      images: [{ categories: [] }]
    },
    streamTarget: null
  },
  {
    _id: 'cj95f3r3100hu07rsqbkye5js',
    title: 'Post Test',
    startTime: 25,
    length: 10,
    plane: 1,
    activityType: 'ac-quiz',
    data: {
      title: 'Stat 101',
      guidelines:
        "Ce Quizz est anonyme, pas noté et ne compte donc en aucun cas pour la note à l'examen final. Une seule réponse est correcte par question. Si vous ne connaissez pas la réponse, répondez NA.",
      questions: [
        {
          answers: [
            '$2/15$',
            '$4/15$',
            '$6/15$',
            '$2/35$',
            '$4/35$',
            '$6/35$',
            'NA'
          ],
          question:
            "A la sortie d'une chaine de production d'une usine, les articles pro- duits ont tous la même probabilité de présenter un défaut. 15 articles choisis au hasard sont contrôlés par le groupe de qualité de l'usine: 2 articles sont destinés au client A, 8 au client B et 5 au client C. Il s'avère que 4 articles présentent un défaut. Quelle est la probabilité que tous les articles destinés au client A présentent un défaut ?"
        },
        {
          question:
            "On sait que la probabilité d'avoir un accident lors d'un trajet sur la route reliant Lausanne à Vevey est égale à 0.01%. On sait également que, sur ce trajet, la probabilité d'avoir un accident est deux fois plus élevée lorsque qu'il pleut que lorsqu'il ne pleut pas. On sait enfin qu'il pleut 20% du temps sur ce tronçon routier. Quelle est la probabilité d'avoir un accident lorsqu'il pleut sur la route reliant Lausanne à Vevey?",
          answers: [
            '$0.02 \\%$',
            '$0.01\\bar{6} \\%$',
            '$0.008\\bar{3} \\%$',
            '$0.01\\bar{3} \\%$',
            'NA'
          ]
        }
      ]
    },
    streamTarget: null
  },
  {
    _id: 'cj95f3r3100hv07rsn01tip71',
    title: 'Briefing',
    startTime: 20,
    length: 5,
    plane: 3,
    activityType: 'ac-image',
    data: { images: [{ categories: [] }] },
    streamTarget: null
  },
  {
    _id: 'cj95f3r3100hw07rsl9e31r2k',
    title: 'Text',
    startTime: 0,
    length: 1,
    plane: 3,
    activityType: 'ac-text',
    data: { title: 'Cette activité va bientôt commencer' },
    streamTarget: null
  },
  {
    _id: 'cj95f3r3100hx07rsqd8f725x',
    title: 'Highlighting',
    startTime: 11,
    length: 9,
    plane: 3,
    activityType: 'ac-classifier',
    data: {
      title: 'Selecting images to bookmark',
      images: [],
      categories: []
    },
    streamTarget: null
  },
  {
    _id: 'cj95f3r3100hy07rseokqlukb',
    title: 'Commenting Solutions',
    startTime: 11,
    length: 9,
    plane: 2,
    activityType: 'ac-image',
    data: {
      guidelines:
        'Ces images ont été tirées aléatoirement des représentations générées par les autres groupes. Elles peuvent représenter un raisonnement correct ou incorrect. Choisissez-en une et commentez son utilité ou ses erreurs dans le champ de texte.',
      canVote: false,
      canUpload: false,
      canComment: true,
      commentGuidelines: 'Veuillez commenter cette représentation',
      hideCategory: true,
      images: [],
      minVote: 1
    },
    groupingKey: 'group',
    streamTarget: null
  }
];
