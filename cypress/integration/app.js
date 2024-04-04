/* global cy */
describe('Example test suite', () => {
    it('should visit the home page', () => {
        cy.visit('/');
        cy.contains('Welcome to My App');
    });
});