import { $, browser } from '@wdio/globals';
import allure from '@wdio/allure-reporter';

class DestinationDetailsPage {
    public get eventsTab() {
        return $('//div[@role="tab"][normalize-space()="Events"]'); // PLACEHOLDER: Verify this selector
    }

    public get deliveredEventsCount() {
        return $('//div[@class="sc-hHvloA bqDHF"]//div[1]//div[1]'); // PLACEHOLDER: Verify this selector
    }

    public get failedEventsCount() {
        return $('//div[@class="sc-ezGUFx sc-bgHAhq gEzaRR gVmjkq"]//div[3]//div[1]'); // PLACEHOLDER: Verify this selector
    }

    public get refreshButton() {
        return $('//span[normalize-space()="Refresh"]'); // PLACEHOLDER: Verify this selector
    }

    public async navigateToEventsTab() {
        await this.eventsTab.waitForClickable({ timeout: 10000 });
        await this.eventsTab.click();
        await browser.pause(2000);

        if (await this.refreshButton.isDisplayed()) {
            await this.refreshButton.click();
            await browser.pause(3000);
        }
    }

    public async getDeliveredEventsCount(): Promise<string> {
        await this.deliveredEventsCount.waitForDisplayed({ timeout: 10000 });
        const count = await this.deliveredEventsCount.getText();
        allure.addAttachment('Delivered Events Count', count, 'text/plain');
        return count.trim();
    }

    public async getFailedEventsCount(): Promise<string> {
        await this.failedEventsCount.waitForDisplayed({ timeout: 10000 });
        const count = await this.failedEventsCount.getText();
        allure.addAttachment('Failed Events Count', count, 'text/plain');
        return count.trim();
    }
}

export default new DestinationDetailsPage();