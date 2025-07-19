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