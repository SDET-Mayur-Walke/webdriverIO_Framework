import { $ } from '@wdio/globals';
import allure from '@wdio/allure-reporter'; 

class LoginPage {
    public get emailInput() { return $('#text-input-email'); }
    public get passwordInput() { return $('#text-input-password'); }
    public get loginButton() { return $('button[type="button"]*=Log in'); }
    public get doThisLaterLink() { return $('a*=I\'ll do this later'); }
    public get goToDashboardButton() { return $('button[type="button"]*=Go to dashboard'); }

    public open () {
        return browser.url('');
    }

    public async login (username: string, password_here: string) {
        await this.emailInput.waitForEnabled({ timeout: 15000, timeoutMsg: 'Email input not enabled' });
        await this.passwordInput.waitForEnabled({ timeout: 15000, timeoutMsg: 'Password input not enabled' });

        await this.emailInput.setValue(username);
        await this.passwordInput.setValue(password_here);

        await this.loginButton.waitForClickable({ timeout: 15000, timeoutMsg: 'Login button not clickable' });
        await this.loginButton.click();
    }

    public async bypass2FAIfPresent() {
        // Corrected: Removed 'timeout' from isDisplayed() as it's not a valid parameter.
        // isDisplayed() checks immediate visibility.
        const isDialogPresent = await this.doThisLaterLink.isDisplayed();

        if (isDialogPresent) {
            allure.addStep('2FA bypass dialog detected. Attempting to dismiss.');
            await this.doThisLaterLink.click();
            await this.doThisLaterLink.waitForDisplayed({ timeout: 10000, reverse: true, timeoutMsg: '2FA dialog did not disappear' });
            allure.addStep('2FA bypass dialog dismissed.');
        } else {
            allure.addStep('No 2FA bypass dialog detected.');
        }
    }

  public async goToDashboardIfPresent() {
    // Corrected: Removed the 'timeout' option from isDisplayed()
    const isGoToDashboardButtonPresent = await this.goToDashboardButton.isDisplayed(); 

    if (isGoToDashboardButtonPresent) {
        allure.addStep('Go to Dashboard button detected. Clicking to proceed.');
        await this.goToDashboardButton.click();
        await this.goToDashboardButton.waitForDisplayed({ timeout: 20000, reverse: true, timeoutMsg: 'Go to dashboard button did not disappear' });
        allure.addStep('Navigated to dashboard.');
    } else {
        allure.addStep('No Go to Dashboard button detected.');
    }
    }
}

export default new LoginPage();