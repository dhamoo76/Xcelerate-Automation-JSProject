
const mainPage = require('./main.page');
const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    // get inputUsername () { return $('#username') }
    get inputUsername() { return $('#idp-discovery-username') }
    get inputPassword() { return $('#okta-signin-password') }
    get btnNext() { return $('#idp-discovery-submit') }
    get btnSignIn() { return $('#okta-signin-password') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login(username/** ,password*/) {
        await this.inputUsername.setValue(username)
        await this.btnNext.click() 
        //  await this.inputPassword.setValue(password);
        // await this.btnSignIn.click();
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open() {
        return super.open('login');
    }
}

module.exports = new LoginPage();
