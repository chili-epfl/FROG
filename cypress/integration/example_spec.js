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
    cy.get('div div div div div ul li a').then(x => {
      x.each(function() {
        if (this.innerText !== 'ac-ck-board') {
          cy.contains(this.innerText).click();
          cy
            .get('div div div div ul li.examples a')
            .each(function($el, i, $list) {
              cy.wrap($el).click();
            });
          cy.get('button.close').click();
        }
      });
      return undefined;
    });
  });
});
