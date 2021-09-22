describe('Nav Menus', () => {
  // For desktop view
  context('Login Flow', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    describe('Basic Login Functionality', () => {
      it('Should navigate to login page', () => {
        cy.visit('/');
        cy.get('[data-cy=login-link]').click();
        cy.url().should('include', '/login');
      });

      it('Should let the user login', () => {
        cy.visit('/login');
        cy.get('[data-cy=username-input]').type(Cypress.env('login'));
        cy.get('[data-cy=password-input]').type(Cypress.env('password'));
        cy.get('[data-cy=login-button]').click();
      });
    });
  });

  context('Basic App Usage', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
      cy.visit('/login');
      cy.get('[data-cy=username-input]').type(Cypress.env('login'));
      cy.get('[data-cy=password-input]').type(Cypress.env('password'));
      cy.get('[data-cy=login-button]').click();
    });

    it('Should let the user search for campgrounds', () => {
      cy.get('[data-cy=plan-trip]').click();
      cy.get('[data-cy=search-input]').type('yosemite');
      cy.wait(3000);
      cy.get('.recrebot-search-result').should('have.length.greaterThan', 10);
    });
  });
});
