// @flow
import { sample } from 'lodash';

export const texts = {
  start: 'Start',
  yes: 'YES',
  no: 'NO',
  end: 'Activity completed! Thank you!',
  timeLeft: 'Time left in Task -> '
};

export const CITIES = [
  'basel',
  'davos',
  'fribourg',
  'geneve',
  'lausanne',
  'neuchatel',
  'zurich'
];

export const FARES = ['standard', 'young', 'half-fare'];
export const TRAVELDIRECTION = ['one-way', 'return'];
export const CLASS = ['1st', '2nd'];
export const WANTBIKE = ['yes', 'no'];

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const lowercaseFirstLetter = (string: string) =>
  string.charAt(0).toLowerCase() + string.slice(1);

export function getCommandForTicket(ticket: Object) {
  return `Please order a ${ticket.fare} ${ticket.travel} ${
    ticket.class
  } class ticket from ${capitalizeFirstLetter(
    ticket.from
  )} to  ${capitalizeFirstLetter(ticket.to)} ${
    ticket.bike === 'yes' ? 'with a bike' : 'without bike'
  }.`;
}
export function generateTicket() {
  const randomFrom = sample(CITIES);
  const randomTo = sample(CITIES.filter(city => city !== randomFrom));

  return {
    from: randomFrom,
    to: randomTo,
    travel: sample(TRAVELDIRECTION),
    class: sample(CLASS),
    bike: sample(WANTBIKE),
    fare: sample(FARES)
  };
}

export function commandDataStructure(command: string) {
  console.log(command);
  const answer = command.split(' ').filter(t => t !== 'from' && t !== 'to');
  const cities = answer.splice(0, 2).map(city => lowercaseFirstLetter(city));

  const bikeIndex = answer.indexOf('bike');
  if (bikeIndex === 1) {
    answer[bikeIndex] = 'yes';
  } else if (bikeIndex === -1) {
    answer.splice(1, 0, 'no');
  }

  const C1 = answer.indexOf('C1');
  const C2 = answer.indexOf('C2');
  if (C1 === 2) {
    answer[2] = '1st';
  } else if (C2 === 2) {
    answer[2] = '2nd';
  } else {
    answer.splice(2, 0, '2nd');
  }

  const young = answer.indexOf('young');
  const halfFare = answer.indexOf('half-fare');
  const standard = answer.indexOf('standard');

  if (young > -1) {
    answer[0] = 'young';
  } else if (halfFare > -1) {
    answer[0] = 'half-fare';
  } else if (standard > -1) {
    answer[0] = 'standard';
  } else {
    answer.splice(0, 0, 'standard');
  }

  console.log(answer);

  return {
    from: cities[0],
    to: cities[1],
    fare: answer[0],
    bike: answer[1],
    class: answer[2],
    travel: answer[3]
  };
}

export const testing = true;
