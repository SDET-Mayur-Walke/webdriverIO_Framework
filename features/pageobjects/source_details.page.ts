// In: pageobjects/source.details.page.ts

import { $ } from '@wdio/globals';

class SourceDetailsPage {
    public get writeKeyElement() {
        // Keep your confirmed precise locator here
        return $('.sc-hHvloA.kaxrgG div.sourceSetup_writeKey__engIE');
    }

    public get setupTabButton() {
        // Keep your confirmed robust XPath here
        return $('//div[@role="tab"][normalize-space()="Setup"]');
    }

    async navigateToSetupTab() {
        await this.setupTabButton.waitForClickable({ timeout: 10000, timeoutMsg: 'Setup tab button not clickable' });
        await this.setupTabButton.click();
        await this.writeKeyElement.waitForDisplayed({ timeout: 5000 });
    }

    async getWriteKey(): Promise<string> {
        await this.navigateToSetupTab(); // Ensure we are on the Setup tab

        await this.writeKeyElement.waitForDisplayed({ timeout: 10000 });
        const rawKey = await this.writeKeyElement.getText();

        // Use the provided logic to strip the "Write key" prefix and trim.
        // Also add a more aggressive cleanup for any remaining non-alphanumeric chars
        let extractedKey = rawKey.replace(/^Write\s*key\s*/i, '').trim(); // Remove "Write key" prefix and trim

        // Optional: Add a final regex to ensure it's purely alphanumeric if needed,
        // but the replace and trim should be sufficient given the "Write key" prefix.
       // extractedKey = extractedKey.replace(/[^a-zA-Z0-9]/g, '');

        console.log(`DEBUG: Extracted Write Key: "${extractedKey}"`);
        // You might want to add a check here for length too
        if (extractedKey.length < 25) { // Rudderstack keys are typically 32+ characters
            throw new Error(`Extracted key is too short: "${extractedKey}"`);
        }

        return extractedKey;
    }
}

export default new SourceDetailsPage();