/* eslint-disable */

describe('Logging in', function() {
  it('logging in as teacher', function() {
    cy.visit('http://localhost:3000/teacher?login=teacher');
  });
  it('teacher basic panes', function() {
    cy.contains('Unnamed');
    cy.contains('Teacher View').click();
    cy.contains('Create Session');
  });
  it.only('preview', function() {
    cy.visit('http://localhost:3000/teacher?login=teacher');
    cy.contains('Activity Creator').click();
    cy.get('.listitem').then(x => {
      x.each(function() {
        if (this.innerText !== 'Dashboard activity') {
          cy.contains(this.innerText.trim()).click();
          cy.get('.example', { force: true }).each(function($el, i, $list) {
            cy.wrap($el).click({ force: true });
          });
          cy.get('.arrowback', { force: true }).click();
        }
      });
      return undefined;
    });
  });
});
