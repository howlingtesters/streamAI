import { test, expect } from './fixtures';

test('should display all main texts on the page', async ({ characterCreatorPage }) => {
  // Arrange - otwieramy stronę
  await characterCreatorPage.goto();
  
  // Note: Browser is automatically closed by Playwright after test execution

  // Assert - sprawdzamy czy główne elementy są widoczne używając stabilnych selektorów
  
  // Step 1: Verify page headers
  await characterCreatorPage.verifyPageHeaders();
  
  // Step 2: Verify form fields and labels
  await characterCreatorPage.verifyFormFieldsAndLabels();
  
  // Step 3: Verify race options in dropdown
  await characterCreatorPage.verifyRaceOptions();
  
  // Step 4: Verify character class selection
  await characterCreatorPage.verifyCharacterClassSelection();
  
  // Step 5: Verify character stats fields
  await characterCreatorPage.verifyCharacterStatsFields();
  
  // Step 6: Verify action buttons and sections
  await characterCreatorPage.verifyActionButtonsAndSections();
  await characterCreatorPage.page.close();
});

