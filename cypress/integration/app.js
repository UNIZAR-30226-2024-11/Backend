/* global cy */
it('Example test', function() {
    it('should visit the home page', function() {
        cy.visit('https://localhost:8000');
        // cy.contains('Welcome to My App');
    });
});