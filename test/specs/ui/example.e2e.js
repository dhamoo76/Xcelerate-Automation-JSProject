const loginPage = require('../../pageobjects/login.page');
const mainPage = require('../../pageobjects/main.page');




describe('LOGIN RSM CEM/ETL', () => {
    it('should login with valid credentials', async () => {
        await loginPage.open()
        await loginPage.login('Natalia.Kharlanova@rsmus.com')
        await expect(mainPage.buttonCurrentUser).toBeDisplayed()
        //Example for test failure :
       // await expect(mainPage.FakeForExampleFailureButtonCurrentUser).toBeDisplayed()
      
    });
});

