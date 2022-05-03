const { remote } = require('webdriverio');

describe('Oppia HomePage', () => {
  it('should opne the oppia on local server', async() => {
    const browser = await remote({
      capabilities: {
        browserName: 'chrome'
      }
    });
    await browser.url('www.webdriver.io');
    await expect(browser).toHaveTitle(
      'WebdriverIO · Next-gen browser and mobile' +
      'automation test framework for Node.js | WebdriverIO');
  });
});
