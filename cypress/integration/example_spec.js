/* eslint-disable */

describe('Logging in', function() {
  it('logging in as teacher', function() {
    cy.visit('http://localhost:3000');
    cy.title().should('include', 'FROG');
    cy.contains('Log in as teacher').click();
    cy.title().should('include', 'FROG');
  });
  it('teacher basic panes', function() {
    cy.contains('Unnamed');
    cy.contains('Teacher View').click();
    cy.contains('Create Session');
  });
  it.only('preview', function() {
    cy.visit('http://localhost:3000?login=teacher');
    cy.contains('Preview').click();
    cy.get('div.list-group-item h5').then(x => {
      x.each(function() {
        if (this.innerText !== 'ac-ck-board') {
          cy.contains(this.innerText.trim()).click();
          cy
            .get('li.examples a', { force: true })
            .each(function($el, i, $list) {
              cy.wrap($el).click({ force: true });
            });
          cy.get('.glyphicon-arrow-left', { force: true }).click();
        }
      });
      return undefined;
    });
  });
});
