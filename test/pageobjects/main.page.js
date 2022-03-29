const { expect } = require('chai');
const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class MainPage extends Page {
    /**
     * define selectors using getter methods
     */
    get buttonCurrentUser () { return $('button[aria-label="account of current user"]') }
    get FakeForExampleFailureButtonCurrentUser () { return $('button[aria-label="account of current userxxxxxxxxxxxxxxxxx"]') }
    

    

}

module.exports = new MainPage();


