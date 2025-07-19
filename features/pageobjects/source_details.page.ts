import { $ } from '@wdio/globals';
import allure from '@wdio/allure-reporter';

class SourceDetailsPage {
    public get writeKeyElement() {
        return $('div.sourceSetup_writeKey__engIE'); // PLACEHOLDER: Verify this selector
    }

    public async getWriteKey(): Promise<string> {
        await this.writeKeyElement.waitForDisplayed({ timeout: 10000 });
        const fullText = await this.writeKeyElement.getText();
        const key = fullText.replace('Write key', '').trim();

        allure.addAttachment('HTTP Source Write Key Captured', key, 'text/plain');
        return key;
    }
}

export default new SourceDetailsPage();