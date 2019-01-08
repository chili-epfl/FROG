/* eslint-disable */
const uuid = require('cuid');
describe('Logging in', function() {
  it('logging in as teacher', function() {
    cy.wait(Math.random() * 30000);
    cy.visit('https://icchilisrv1.epfl.ch/P3CI?login=' + uuid());
    cy.wait(60000);
    return undefined;
  });
});
