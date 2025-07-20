// In: pageobjects/connections.page.ts

import { $, browser } from '@wdio/globals';
import allure from '@wdio/allure-reporter'; // Keep existing imports

class ConnectionsPage {
    public get dataPlaneUrlElement() {
        return $('span.sc-jrkPvW.ebfakN');
    }

    public get httpSourceLink() {
        return $('span=my-http-source');
    }

    public get webhookDestinationLink() {
        return $('span=my-webhook-destination'); // This is your element getter
    }

    // UPDATED: Selector for the "Ask AI" pop-up's Close button (X button)
    public get askAICloseButton() {
        return $('button[aria-label="Close"]');
    }

    public async open () {
        if ((await browser.getUrl()) !== (browser.options.baseUrl as string)) {
            await browser.url(browser.options.baseUrl as string);
        }

        await this.dataPlaneUrlElement.waitForDisplayed({
            timeout: 30000,
            timeoutMsg: 'Data Plane URL element not displayed, Connections page might not have loaded correctly.'
        });
        await this.httpSourceLink.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'HTTP Source link not displayed, Connections page content not ready.'
        });

        await this.dismissAskAIOverlayIfPresent();
    }

    public async dismissAskAIOverlayIfPresent() {
        const isAskAIPresent = await this.askAICloseButton.waitForDisplayed({ timeout: 5000, reverse: false });

        if (isAskAIPresent) {
            allure.addStep('Ask AI overlay detected. Attempting to dismiss.');
            await this.askAICloseButton.click();
            await this.askAICloseButton.waitForDisplayed({ timeout: 10000, reverse: true, timeoutMsg: 'Ask AI overlay did not disappear' });
            allure.addStep('Ask AI overlay dismissed.');
        } else {
            allure.addStep('No Ask AI overlay detected.');
        }
    }

    public async getDataPlaneUrl(): Promise<string> {
        await this.dataPlaneUrlElement.waitForDisplayed({ timeout: 10000 });
        const url = await this.dataPlaneUrlElement.getText();
        allure.addAttachment('Data Plane URL Captured', url, 'text/plain');
        return url.trim();
    }

    // Add the clickHttpSource method (if not already there based on your setup)
    public async clickHttpSource() {
        await this.httpSourceLink.waitForClickable({ timeout: 10000 });
        await this.httpSourceLink.click();
    }

    // THIS IS THE NEW METHOD TO ADD
    public async clickWebhookDestination() {
        await this.webhookDestinationLink.waitForClickable({ timeout: 10000, timeoutMsg: 'Webhook Destination link not clickable.' });
        await this.webhookDestinationLink.click();
    }
}

export default new ConnectionsPage();