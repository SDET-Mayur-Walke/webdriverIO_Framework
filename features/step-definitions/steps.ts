import { Given, When, Then } from '@cucumber/cucumber';
import { browser } from '@wdio/globals';
import axios from 'axios';
import allure from '@wdio/allure-reporter';

import LoginPage from '../pageobjects/login.page';
import ConnectionsPage from '../pageobjects/connections.page';
import SourceDetailsPage from '../pageobjects/source_details.page';
import DestinationDetailsPage from '../pageobjects/destination_details.page';

let dataPlaneUrl: string;
let httpSourceWriteKey: string;

Given('I am logged in to the Rudderstack application', async () => {
  allure.addStep('Logging in to Rudderstack application');
  await LoginPage.open();
  await LoginPage.login(process.env.RUDDERSTACK_USERNAME as string, process.env.RUDDERSTACK_PASSWORD as string);
  await LoginPage.bypass2FAIfPresent();
  await LoginPage.goToDashboardIfPresent();

  // ***** CRITICAL FOR DEBUGGING *****
  // PAUSE FOR 30 SECONDS HERE!
  // DURING THIS PAUSE, MANUALLY CHECK THE BROWSER'S ADDRESS BAR AND COPY THE EXACT URL.
  await browser.pause(30000);

  // THIS WAIT UNTIL IS CURRENTLY COMMENTED OUT/BYPASSED FOR DEBUGGING.
  // We will re-enable and fix it once you provide the exact URL after the pause.
  /*
  await browser.waitUntil(async () => {
    const url = await browser.getUrl();
    return url.includes('/dashboard') || url.includes('/connections');
  }, { timeout: 30000, timeoutMsg: 'Expected to be on dashboard or connections page after login' });
  */

  allure.addStep('Successfully logged in (manual URL check required).');
});

Given('I am on the Connections page', async () => {
    allure.addStep('Navigating to the Connections page');
    await ConnectionsPage.open();
    allure.addStep('On Connections page.');
});

When('I read and store the data plane URL', async () => {
  allure.addStep('Reading and storing Data Plane URL');
  dataPlaneUrl = await ConnectionsPage.getDataPlaneUrl();
  expect(dataPlaneUrl).not.toBeNull();
  expect(dataPlaneUrl.length).toBeGreaterThan(0);
  expect(dataPlaneUrl).toMatch(/^https?:\/\/.+/);
  allure.addStep(`Data Plane URL captured: ${dataPlaneUrl}`);
});

When('I read and store the HTTP source write key', async () => {
  allure.addStep('Reading and storing HTTP Source Write Key');
  await ConnectionsPage.httpSourceLink.click();
  await browser.waitUntil(async () => (await browser.getUrl()).includes('/sources/'),
    { timeout: 15000, timeoutMsg: 'Failed to navigate to HTTP source details page' });

  httpSourceWriteKey = await SourceDetailsPage.getWriteKey();
  expect(httpSourceWriteKey).not.toBeNull();
  expect(httpSourceWriteKey.length).toBeGreaterThan(0);
  allure.addStep(`HTTP Source Write Key captured.`);
});

When('I send an event to the HTTP source via API', async () => {
  allure.addStep('Sending event to HTTP source via API');
  const eventPayload = {
    anonymousId: 'automation-test-user',
    event: 'RudderstackTestEvent',
    properties: {
      timestamp: new Date().toISOString(),
      testId: `auto-${Date.now()}`
    },
    type: 'track'
  };

  if (!dataPlaneUrl || !httpSourceWriteKey) {
    throw new Error('Data Plane URL or HTTP Source Write Key not available. Ensure previous steps ran correctly.');
  }

  const apiUrl = `${dataPlaneUrl}/v1/track`;

  try {
    const response = await axios.post(apiUrl, eventPayload, {
      headers: {
        'Authorization': `Basic ${Buffer.from(httpSourceWriteKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });
    expect(response.status).toBe(200);
    allure.addStep(`API Event Sent Successfully. Status: ${response.status}`);
  } catch (error: any) {
    allure.addStep(`API call failed: ${error.message}`, true);
    if (error.response) {
        allure.addAttachment('API Error Response', JSON.stringify(error.response.data), 'application/json');
        console.error('API Response Data:', error.response.data);
        console.error('API Response Status:', error.response.status);
    }
    throw new Error(`API call failed: ${error.message}`);
  }
});

When('I navigate to the Webhook destination details', async () => {
  allure.addStep('Navigating to Webhook destination details');
  await ConnectionsPage.open();
  await ConnectionsPage.webhookDestinationLink.click();
  await browser.waitUntil(async () => (await browser.getUrl()).includes('/destinations/'),
    { timeout: 15000, timeoutMsg: 'Failed to navigate to Webhook destination details page' });
  allure.addStep('On Webhook destination details page.');
});

When('I navigate to the Events tab', async () => {
  allure.addStep('Navigating to Events tab and refreshing counts');
  await DestinationDetailsPage.navigateToEventsTab();
  allure.addStep('On Events tab, counts should be updated.');
});

Then('the delivered events count should be {string}', async (expectedCount: string) => {
  allure.addStep(`Verifying delivered events count is "${expectedCount}"`);
  const deliveredCount = await DestinationDetailsPage.getDeliveredEventsCount();
  expect(deliveredCount).toEqual(expectedCount);
  allure.addStep(`Delivered events count matched: ${deliveredCount}.`);
});

Then('the failed events count should be {string}', async (expectedCount: string) => {
  allure.addStep(`Verifying failed events count is "${expectedCount}"`);
  const failedCount = await DestinationDetailsPage.getFailedEventsCount();
  expect(failedCount).toEqual(expectedCount);
  allure.addStep(`Failed events count matched: ${failedCount}.`);
});