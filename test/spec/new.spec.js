const { remote } = require('webdriverio');

describe('Blog dashboard functionality', function() {
  const browser = await remote({
    capabilities: {
      browserName: 'chrome'
    }
  });
  var blogDashboardPage = null;

  it('should Performing a search operation', async() => {

    await browser.url('https://localhost:8181');

    var loginPage = browser.element('.protractor-test-login-page');
    const loginButton = await browser.$('=API');
    await apiLink.click();

    await browser.saveScreenshot('./screenshot.png');
    await browser.deleteSession();
  });
});
