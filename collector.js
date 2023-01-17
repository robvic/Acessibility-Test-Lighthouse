const fs = require('fs');
const lighthouse = require('lighthouse');
const config = require('./custom-config');
const chromeLauncher = require('chrome-launcher');
const date = new Date();
const product = 'g1'

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;

(async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  //const chrome = await chromeLauncher.launch();
  //const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], formFactor: 'desktop', screenEmulation: {disabled: true}, port: chrome.port};
  //const runnerResult = await lighthouse('https://google.com', {port: 9222}, config);
  //const runnerResult = await lighthouse('https://g1.globo.com', options);
  const flags = {logLevel: 'info', output: 'json', onlyCategories: ['accessibility'], port: chrome.port};
  const config = {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        },
        emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4143.7 Safari/537.36 Chrome-Lighthouse'
      }
    };
    const runnerResult = await lighthouse('https://g1.globo.com', flags, config);

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  const filename = `lighthouse-${product}_${currentDate}.json`
  fs.writeFileSync(filename, reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log('Accessibility score was', runnerResult.lhr.categories.accessibility.score * 100);

  await chrome.kill();
})();