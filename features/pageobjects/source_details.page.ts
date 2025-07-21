import { $ } from '@wdio/globals';

class SourceDetailsPage {
    public get writeKeyElement() {
        return $('.sc-hHvloA.kaxrgG div.sourceSetup_writeKey__engIE');
    }

    public get setupTabButton() {
        return $('//div[@role="tab"][normalize-space()="Setup"]');
    }

    async navigateToSetupTab() {
        await this.setupTabButton.waitForClickable({ timeout: 10000, timeoutMsg: 'Setup tab button not clickable' });
        await this.setupTabButton.click();
        await this.writeKeyElement.waitForDisplayed({ timeout: 5000 });
    }

    async getWriteKey(): Promise<string> {
        await this.navigateToSetupTab(); 

        await this.writeKeyElement.waitForDisplayed({ timeout: 10000 });
        const rawKey = await this.writeKeyElement.getText();

        let extractedKey = rawKey.replace(/^Write\s*key\s*/i, '').trim(); 
        console.log(`DEBUG: Extracted Write Key: "${extractedKey}"`);
        if (extractedKey.length < 25) { 
            throw new Error(`Extracted key is too short: "${extractedKey}"`);
        }

        return extractedKey;
    }
}

export default new SourceDetailsPage();