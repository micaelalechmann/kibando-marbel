
describe('Heroes', () => {

  beforeEach(() => {
    cy.server();
    cy.route('GET', 'http://localhost:4200/api/heroes').as('heroes');
    cy.route('DELETE', 'http://localhost:4200/api/heroes/*').as('deleteHeroes');
    cy.route('POST', 'http://localhost:4200/api/heroes').as('addHero');

    cy.visit('http://localhost:4200/heroes');
    cy.wait('@heroes');
  })

  it('Should not add hero from a blank input', () => {
    cy.get('ul')
      .get('li').then($li => {
        const initialLength = $li.length;
        cy.get('#addBtn').click();
        cy.get('li').its('length').should('be.eq', initialLength);
      })
  })

  it('Should add Heroes', () => {
    cy.get('input')
      .type('Blue Widow');
    cy.get('#addBtn').click();
    cy.wait('@addHero');
    cy.wait('@heroes');

    cy.visit('http://localhost:4200/heroes');
    cy.wait('@heroes');

    cy.get('li').eq(-1).contains('Blue Widow');
  });

  it('Should delete Heroes', () => {
    cy.request('POST', 'http://localhost:4200/api/heroes', {
      "name": "Betman",
      "category": "Rich"
    });

    cy.visit('http://localhost:4200/heroes');
    cy.wait('@heroes');

    cy.get('.heroes').within(($ul) => {
      cy.get('li').then($li => {

        const itemsLength = $li.length;

        cy.get('button').eq(itemsLength - 1).click();
        cy.wait('@deleteHeroes');

        cy.visit('http://localhost:4200/heroes');
        cy.wait('@heroes');

        cy.get('li').its('length').should('be.lt', itemsLength);
      });
    });
  });

  it('Should visit hero page when hero is clicked', () => {
    const getFirstHero = () => cy.get('li')
      .eq(0);

    getFirstHero().get('#heroName').invoke('text').then(text => {
      getFirstHero().click();
      cy.get('h2').first().contains(text.toUpperCase());
    });

  })
});
