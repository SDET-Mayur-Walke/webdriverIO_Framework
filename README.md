# Rudderstack Event Flow Automation

This repository provides an automated test framework using **WebdriverIO** and **CucumberJS** for validating fundamental event flows in the Rudderstack application. The project aligns with the requirements detailed in the SDET Assignment document.

---

## Table of Contents

- [Overview](#1-overview)
- [Specifications](#2-specifications)
- [Framework Details](#3-framework-details)
- [Workspace Setup (Manual Prerequisites)](#4-workspace-setup-manual-prerequisites)
- [Local Setup & Running Tests](#5-local-setup--running-tests)
- [CI/CD Implementation (GitHub Actions)](#6-cicd-implementation-github-actions)

---

## 1. Overview

The goal of this assignment is to create a test plan and automation implementation for Rudderstack’s core event flow. The automated test verifies end-to-end delivery of an event sent via the HTTP API, ensuring its arrival at a Webhook destination.

---

## 2. Specifications

The automation is built to meet the following:

- **Frameworks:** WebdriverIO (JavaScript/TypeScript supported) with CucumberJS as the test runner.
- **.env File:** Used for securing credentials across environments (dev, qa, production).
- **Project Structure:** Organized with config files (`package.json`, `tsconfig.json`), page objects, step definitions, and `README.md`.
- **CI/CD:** Includes a GitHub workflow for scheduled test runs.

---

## 3. Framework Details

- **Language:** TypeScript
- **Test Runner:** CucumberJS
- **Automation Framework:** WebdriverIO
- **Design Pattern:** Page Object Model (POM) for maintainable selectors/interactions:
  - `pageobjects/login.page.ts`: Login actions
  - `pageobjects/connections.page.ts`: Rudderstack Connections page
  - `pageobjects/source_details.page.ts`: HTTP Source page
  - `pageobjects/destination_details.page.ts`: Webhook Destination page
- **API Testing:** Utilizes `axios` to send events to the HTTP source
- **Reporting:** Integrated with `allure-reporter` for detailed test reports

### Test Scenario

The main test (`features/rudderstack_event_flow.feature`) covers:

Feature: Rudderstack Event Flow Verification

Scenario: Verify event delivery to Webhook Destination via API
Given I am logged in to the Rudderstack application
And I am on the Connections page
When I read and store the data plane URL
And I read and store the HTTP source write key
And I send an event to the HTTP source via API
And I navigate to the Webhook destination details
And I navigate to the Events tab
Then the delivered events count should be "1"
And the failed events count should be "0"


> **Note:** The test dynamically verifies the delivered count increases by one. For a strict `"1"` assertion, ensure a fresh destination with zero prior events.

---

## 4. Workspace Setup (Manual Prerequisites)

Before executing automation, set up the Rudderstack workspace:

1. **Sign Up:**
   - Visit [Rudderstack](https://app.rudderstack.com).
   - Use a business email (e.g., from [temp-mail.org](https://temp-mail.org/en/)).
   - Select *Rudder Cloud*.

2. **Create HTTP Source:**
   - Go to *Sources* in the dashboard.
   - Add a new source > **HTTP**
   - Name: `my-http-source` (update `connections.page.ts` if different).

3. **Create Webhook Destination:**
   - Go to *Destinations* in the dashboard.
   - Add a new destination > **Webhook**
   - Name: `my-webhook-destination` (update code if different).
   - Use a URL from [requestcatcher.com](https://www.requestcatcher.com) or [webhook.site](https://webhook.site). Ensure it’s fresh if you want the "delivered count should be 1" check to pass the first time.

---

## 5. Local Setup & Running Tests

### **Prerequisites**

- Node.js (v22.x recommended)
- npm or Yarn
- Git

### **Installation**

git clone <your-repository-url>
cd <your-repository-name>
npm install


### **Environment Variables (`.env`)**

In your project root (same level as `package.json`):

RUDDERSTACK_USERNAME=your_rudderstack_email@example.com
RUDDERSTACK_PASSWORD=your_rudderstack_password
RUDDERSTACK_BASE_URL=https://app.rudderstack.com
HTTP_SOURCE_NAME=my-http-source
WEBHOOK_DESTINATION_NAME=my-webhook-destination


> **Note:** Source and destination names must match those created in the Rudderstack app.

### **Running Tests Locally**

npx wdio run ./wdio.conf.ts


This uses your `.env` credentials and project config.

---

## 6. CI/CD Implementation (GitHub Actions)

A workflow is provided in `.github/workflows/daily-test-run.yml` for automated daily execution.

### **Workflow Details**

- **Name:** Daily UI/API Test Run
- **Trigger:**
  - `workflow_dispatch` (manual)
  - `schedule`: Daily at 05:30 UTC *(cron adjustable)*
- **Runner:** `ubuntu-latest`
- **Node.js:** v22
- **Steps:**
  - Checkout code
  - Setup Node.js
  - `npm install`
  - Generate `.env` from GitHub Secrets
  - Run WebdriverIO tests
  - Upload Allure Report as artifact

### **GitHub Secrets (CRITICAL)**

Add repository secrets for CI:

- `RUDDERSTACK_USERNAME`
- `RUDDERSTACK_PASSWORD`
- `RUDDERSTACK_BASE_URL` (optional)

Set in:

`GitHub Repo > Settings > Secrets and variables > Actions > New repository secret`

### **Viewing CI/CD Runs**

- Actions tab > select workflow > view logs and download artifacts (e.g., Allure report)

---




