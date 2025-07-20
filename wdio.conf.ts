import * as dotenv from 'dotenv';
dotenv.config();

export const config: WebdriverIO.Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './features/**/*.feature'
    ],
    exclude: [],
    
    //
    // ============
    // Capabilities
    // ============
    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome',
        // Removed: goog:chromeOptions for clipboard, as services are now managed by WDIO directly
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: process.env.RUDDERSTACK_BASE_URL || 'https://app.rudderstack.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // Updated: Test runner services - using empty array for WebdriverIO's built-in driver management
    services: [], 
    
    //
    // Framework you want to run your specs with.
    framework: 'cucumber',
    
    reporters: ['spec',['allure', {outputDir: 'allure-results'}]],

    cucumberOpts: {
        require: ['./features/step-definitions/steps.ts'],
        pageObjects: './features/pageobjects/**/*.ts',
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        name: [],
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },
};