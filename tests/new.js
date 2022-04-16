const { remote } = require('webdriverio');

describe('my awesome website', () => {
  it('should do some assertions', async() => {
    const browser = await remote({
      capabilities: {
        browserName: 'chrome'
      }
    });
    await browser.url('https://webdriver.io');
    await expect(browser).toHaveTitle(
      'WebdriverIO · Next-gen browser and mobile' +
      'automation test framework for Node.js | WebdriverIO');
    browser.end();
  });
});
