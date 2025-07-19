import { $ } from '@wdio/globals';

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
        const is2FADialogPresent = await this.doThisLaterLink.waitForDisplayed({ timeout: 5000, reverse: false });

        if (is2FADialogPresent) {
            await this.doThisLaterLink.click();
            await this.doThisLaterLink.waitForDisplayed({ timeout: 10000, reverse: true, timeoutMsg: '2FA dialog did not disappear' });
        }
    }

    public async goToDashboardIfPresent() {
        const isGoToDashboardButtonPresent = await this.goToDashboardButton.waitForDisplayed({ timeout: 5000, reverse: false });

        if (isGoToDashboardButtonPresent) {
            await this.goToDashboardButton.click();
            await this.goToDashboardButton.waitForDisplayed({ timeout: 15000, reverse: true, timeoutMsg: 'Go to dashboard button did not disappear' });
        }
    }
}

export default new LoginPage();