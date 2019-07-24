import { Scenario, Given, When, Then } from '../../gherkin';

describe('Common Wiki Operations', () => {
  Scenario('Creating a new wiki', () => {
    When(`We go to a random wiki page`, () => {
      cy.visitRandomWiki();
    });
    Then('A new wiki should be created with one page: Home', () => {
      cy.getByTestId('wiki_page_title').contains('Home');
      cy.location('pathname').should('match', /\/Home$/);
    });
    Then('Wiki settings should be available', () => {
      cy.getByTestId('secondary-menu-button').click();
      cy.get('#overflow-menu').contains('Wiki Settings');
    });
  });

  Scenario('Wiki Lists', () => {
    Given('A wiki already has been created', () => {
      cy.visitRandomWiki();
    });
    When('We visit http://localhost:3000/wiki', () => {
      cy.visit('/wiki');
    });
    Then('A list of wikis should be displayed', () => {
      cy.getByTestId('wiki-links').within(() => {
        cy.getAllByTestId('wiki-link');
      });
    });
  });
});
