// @flow
import { shuffle } from 'lodash';

const hardcodedList = shuffle([
  {
    isConsistent: false,
    isCorrect: true,
    fr: { objectName: 'citron', colorName: 'jaune' },
    en: { objectName: 'lemons', colorName: 'yellow' },
    colorFill: 'red'
  },
  {
    isConsistent: false,
    isCorrect: false,
    fr: { objectName: 'bois', colorName: 'jaune' },
    en: { objectName: 'wood', colorName: 'yellow' },
    colorFill: 'red'
  },
  {
    isConsistent: true,
    isCorrect: true,
    fr: { objectName: 'sang', colorName: 'rouge' },
    en: { objectName: 'blood', colorName: 'red' },
    colorFill: 'red'
  },
  {
    isConsistent: true,
    isCorrect: false,
    fr: { objectName: 'gazon', colorName: 'rouge' },
    en: { objectName: 'grass', colorName: 'red' },
    colorFill: 'red'
  },
  {
    isConsistent: true,
    isCorrect: true,
    fr: { objectName: 'citron', colorName: 'jaune' },
    en: { objectName: 'lemons', colorName: 'yellow' },
    colorFill: 'yellow'
  },
  {
    isConsistent: true,
    isCorrect: false,
    fr: { objectName: 'sang', colorName: 'jaune' },
    en: { objectName: 'blood', colorName: 'yellow' },
    colorFill: 'yellow'
  },
  {
    isConsistent: false,
    isCorrect: true,
    fr: { objectName: 'sang', colorName: 'rouge' },
    en: { objectName: 'blood', colorName: 'red' },
    colorFill: 'yellow'
  },
  {
    isConsistent: false,
    isCorrect: false,
    fr: { objectName: 'ciel', colorName: 'rouge' },
    en: { objectName: 'the sky', colorName: 'red' },
    colorFill: 'yellow'
  },
  {
    isConsistent: true,
    isCorrect: true,
    fr: { objectName: 'ciel', colorName: 'bleu' },
    en: { objectName: 'the sky', colorName: 'blue' },
    colorFill: 'blue'
  },
  {
    isConsistent: true,
    isCorrect: false,
    fr: { objectName: 'bois', colorName: 'bleu' },
    en: { objectName: 'wood', colorName: 'blue' },
    colorFill: 'blue'
  },
  {
    isConsistent: false,
    isCorrect: false,
    fr: { objectName: 'sang', colorName: 'vert' },
    en: { objectName: 'blood', colorName: 'green' },
    colorFill: 'blue'
  },
  {
    isConsistent: false,
    isCorrect: true,
    fr: { objectName: 'gazon', colorName: 'vert' },
    en: { objectName: 'grass', colorName: 'green' },
    colorFill: 'blue'
  },
  {
    isConsistent: true,
    isCorrect: false,
    fr: { objectName: 'ciel', colorName: 'vert' },
    en: { objectName: 'the sky', colorName: 'green' },
    colorFill: 'green'
  },
  {
    isConsistent: true,
    isCorrect: true,
    fr: { objectName: 'gazon', colorName: 'vert' },
    en: { objectName: 'grass', colorName: 'green' },
    colorFill: 'green'
  },
  {
    isConsistent: false,
    isCorrect: true,
    fr: { objectName: 'bois', colorName: 'marron' },
    en: { objectName: 'wood', colorName: 'brown' },
    colorFill: 'green'
  },
  {
    isConsistent: false,
    isCorrect: false,
    fr: { objectName: 'gazon', colorName: 'marron' },
    en: { objectName: 'grass', colorName: 'brown' },
    colorFill: 'green'
  },
  {
    isConsistent: true,
    isCorrect: false,
    fr: { objectName: 'citron', colorName: 'marron' },
    en: { objectName: 'lemons', colorName: 'brown' },
    colorFill: 'brown'
  },
  {
    isConsistent: true,
    isCorrect: true,
    fr: { objectName: 'bois', colorName: 'marron' },
    en: { objectName: 'wood', colorName: 'brown' },
    colorFill: 'brown'
  },
  {
    isConsistent: false,
    isCorrect: true,
    fr: { objectName: 'ciel', colorName: 'bleu' },
    en: { objectName: 'the sky', colorName: 'blue' },
    colorFill: 'brown'
  },
  {
    isConsistent: false,
    isCorrect: false,
    fr: { objectName: 'citron', colorName: 'bleu' },
    en: { objectName: 'lemons', colorName: 'blue' },
    colorFill: 'brown'
  }
]);

export default hardcodedList;
