import { $, browser } from '@wdio/globals';
import allure from '@wdio/allure-reporter';

class ConnectionsPage {
    public get dataPlaneUrlElement() {
        return $('span.sc-jrkPvW.ebfakN'); // PLACEHOLDER: Verify this selector
    }

    public get httpSourceLink() {
        return $('span=my-http-source'); // PLACEHOLDER: Verify this selector
    }

    public get webhookDestinationLink() {
        return $('span=my-webhook-destination'); // PLACEHOLDER: Verify this selector
    }

    public async open () {
        await browser.url('/connections');
        await browser.waitUntil(async () => (await browser.getUrl()).includes('/connections'),
          { timeout: 15000, timeoutMsg: 'Connections page did not load.' });
    }

    public async getDataPlaneUrl(): Promise<string> {
        await this.dataPlaneUrlElement.waitForDisplayed({ timeout: 10000 });
        const url = await this.dataPlaneUrlElement.getText();
        allure.addAttachment('Data Plane URL Captured', url, 'text/plain');
        return url.trim();
    }
}

export default new ConnectionsPage();