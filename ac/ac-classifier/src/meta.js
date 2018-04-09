// @flow

export default {
  name: 'Learning Component Classifier',
  shortName: 'Classifier',
  type: 'react-component',
  shortDesc: 'Quickly display images to classify',
  description:
    'Show to the student images one after the other and the student has to choose what category is the most appropriated one',
  exampleData: [
    {
      title: 'Classify images',
      config: {
        title: "Decide if it's a landscape or an animal",
        images: [
          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Wei%C3%9Fr%C3%BCckengeier_Gyps_africanus_HP_L2043.JPG/500px-Wei%C3%9Fr%C3%BCckengeier_Gyps_africanus_HP_L2043.JPG',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%92_%D0%9C%D0%B8%D1%82%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%BC_%D0%BB%D0%B0%D0%BD%D0%B4%D1%88%D0%B0%D1%84%D1%82%D0%BD%D0%BE%D0%BC_%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_panoramio.jpg/1280px-%D0%92_%D0%9C%D0%B8%D1%82%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%BC_%D0%BB%D0%B0%D0%BD%D0%B4%D1%88%D0%B0%D1%84%D1%82%D0%BD%D0%BE%D0%BC_%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_panoramio.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/02-29-11%2C_covered_picnic_table_-_panoramio.jpg/1280px-02-29-11%2C_covered_picnic_table_-_panoramio.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/H._C._Andersens_Lind.JPG/1280px-H._C._Andersens_Lind.JPG'
        ],
        categories: ['landscape', 'animal']
      },
      data: {}
    },
    {
      title: 'Classify text',
      config: {
        title: 'Please classify these texts',
        categories: ['French', 'German', 'English']
      },
      data: {
        djfksjdfkasjb: {
          key: 'djfksjdfkasjb',
          type: 'text',
          text: 'Bonjour monsieur. Je suis enchanté de faire votre connaissance'
        },
        kjsndkajnkdaj: {
          key: 'kjsndkajnkdaj',
          type: 'text',
          text: 'Hello sir, very nice meeting you'
        },
        sljdlskjallaq: {
          key: 'sljdlskjallaq',
          type: 'text',
          text: "Oh! It's raining today! Where is my umbrella?"
        }
      }
    },
    {
      title: 'Select objects',
      config: {
        title: 'Select examples of student work'
      },
      data: {
        djfksjdfkasjb: {
          key: 'djfksjdfkasjb',
          type: 'text',
          text: 'Bonjour monsieur. Je suis enchanté de faire votre connaissance'
        },
        kjsndkajnkdaj: {
          key: 'kjsndkajnkdaj',
          type: 'text',
          text: 'Hello sir, very nice meeting you'
        },
        sljdlskjallaq: {
          key: 'sljdlskjallaq',
          type: 'text',
          text: "Oh! It's raining today! Where is my umbrella?"
        }
      }
    }
  ]
};
