describe('Common Wiki Operations', () => {
  beforeEach(() => cy.visitRandomWiki());
  it('Open a new wiki', () => {
    cy.getByTestId('wiki_page_title').contains('Home');
    cy.location('pathname').should('match', /\/Home$/);
  });

  it('Create a new wiki page', () => {
    cy.getByTestId('wiki_create_page')
      .click()
      .get('#page-title')
      .type('Test page')
      .getByTestId('create_button')
      .click();

    cy.getByTestId('wiki_page_title').contains('Test page');
    cy.location('pathname').should('match', /\/Test%20page$/);
  });
});
