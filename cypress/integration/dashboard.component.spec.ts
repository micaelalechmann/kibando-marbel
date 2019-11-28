
describe('Dashboard', () => {

    beforeEach(() => {
        cy.server();
        cy.route('GET', 'http://localhost:4200/api/heroes').as('heroes');
        cy.route('GET', 'http://localhost:4200/api/heroes/*').as('heroDetail');
        cy.route('POST', 'http://localhost:4200/api/heroes').as('addHero');
        cy.visit('http://localhost:4200/dashboard');
        cy.wait('@heroes');
    })

    it('should display 5 top heroes', () => {
        cy.get('.module').its('length').should('be.eq', 5);
    })

    it('should visit hero page when hero is clicked', () => {
        const getFirstHero = () => cy.get('.module')
            .eq(0);

        getFirstHero().find('h4').invoke('text').then(text => {
            getFirstHero().click();
            cy.wait('@heroDetail');
            cy.get('h2').first().contains(text.toUpperCase());
        });
    })

    it('should visit page and edit hero name', () => {
        const getFirstHero = () => cy.get('.module')
            .eq(0);

        getFirstHero().click();
        cy.wait('@heroDetail');

        cy.get('input').clear().type('Captain Marbel');
        cy.get('.save').click();

        cy.get('#search-box').type('Captain Marbel');

        cy.get('.search-result').find('li').contains('Captain Marbel');
    })

    it('should visit page and do not edit hero name', () => {
        const getFirstHero = () => cy.get('.module')
            .eq(0);

        getFirstHero().click();
        cy.wait('@heroDetail');

        cy.get('input').clear().type('Hero That Will Not Change');
        cy.get('.go-back').click();

        cy.get('#search-box').type('Hero That Will Not Change');

        cy.get('.search-result').find('li').should('not.contain' ,'Hero That Will Not Change');
    })

    it('Should search and access hero', () => {
        const betman = {
            "name": "Betman",
            "category": "Rich",
        };

        cy.request('POST', 'http://localhost:4200/api/heroes', betman);

        cy.get('#search-box').type('Bet');

        cy.get('.search-result').find('li').then((li) => {
            cy.get(li).invoke('text').should('contain', 'Bet');
        })

        cy.get('.search-result').find('li').contains('Bet').click();
        cy.wait('@heroDetail');

        cy.get('h2').first().contains('BETMAN');
    })
});
