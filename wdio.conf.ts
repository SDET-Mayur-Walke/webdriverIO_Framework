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
        // ADDED: goog:chromeOptions for CI compatibility
        'goog:chromeOptions': {
            args: [
                '--headless=new',           // Run Chrome in new headless mode for CI
                '--disable-gpu',            // Disable GPU hardware acceleration
                '--no-sandbox',             // Disable sandbox (often needed in Linux CI environments like GitHub Actions)
                '--disable-dev-shm-usage',  // Overcomes limited shared memory resource problems
                '--window-size=1920,1080',  // Set a consistent window size
                '--whitelisted-ips=""'      // Allow connections from all IPs, similar to --allowed-ips=*
            ],
            prefs: {
                // Ensure clipboard manager leak detection is disabled as it might not be supported in headless
                "profile.password_manager_leak_detection": false
            }
        },
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
        timeout: 90000, // UPDATED: Increased Cucumber step timeout to 90 seconds
        ignoreUndefinedDefinitions: false
    },
};