import { test, expect } from './fixtures';

test.describe('User Story #1: Character Creation', () => {
  test.beforeEach(async ({ characterCreatorPage }) => {
    await characterCreatorPage.goto();
    await characterCreatorPage.clearLocalStorage();
    await characterCreatorPage.page.reload();
  });

  test('should allow entering character name', async ({ characterCreatorPage }) => {
    // Arrange - page is already loaded in beforeEach
    
    // Assert - verify name field is editable and empty by default
    await characterCreatorPage.verifyNameFieldIsEditable();
    await characterCreatorPage.verifyDefaultName();
    
    // Act - fill custom name
    await characterCreatorPage.fillName('Aragorn');
    
    // Assert - verify name was filled
    const nameValue = await characterCreatorPage.nameInput.inputValue();
    expect(nameValue).toBe('Aragorn');
  });

  test('should allow selecting race from list', async ({ characterCreatorPage }) => {
    // Arrange - page is already loaded in beforeEach
    
    // Act & Assert - verify all race options are available
    await characterCreatorPage.verifyRaceOptions();
    
    // Act - select different races
    await characterCreatorPage.selectRace('Elf');
    await expect(characterCreatorPage.raceSelect).toHaveValue('Elf');
    
    await characterCreatorPage.selectRace('Krasnolud');
    await expect(characterCreatorPage.raceSelect).toHaveValue('Krasnolud');
    
    await characterCreatorPage.selectRace('Ork');
    await expect(characterCreatorPage.raceSelect).toHaveValue('Ork');
    
    await characterCreatorPage.selectRace('Człowiek');
    await expect(characterCreatorPage.raceSelect).toHaveValue('Człowiek');
  });

  test('should allow selecting character class', async ({ characterCreatorPage }) => {
    // Arrange - page is already loaded in beforeEach
    
    // Act & Assert - verify all class options are visible
    await characterCreatorPage.verifyCharacterClassSelection();
    
    // Act - select different classes
    await characterCreatorPage.selectClass('Wojownik');
    await expect(characterCreatorPage.classButtonWarrior).toBeVisible();
    
    await characterCreatorPage.selectClass('Łotrzyk');
    await expect(characterCreatorPage.classButtonRogue).toBeVisible();
    
    await characterCreatorPage.selectClass('Czarodziej');
    await expect(characterCreatorPage.classButtonWizard).toBeVisible();
    
    await characterCreatorPage.selectClass('Zwiadowca');
    await expect(characterCreatorPage.classButtonRanger).toBeVisible();
  });

  test('should allow distributing 15 points between stats', async ({ characterCreatorPage }) => {
    // Arrange - page is already loaded in beforeEach
    
    // Assert - verify initial points (start values: 10+10+10+10=40, points: 15+40-40=15)
    await characterCreatorPage.verifyPointsLeft(15);
    
    // Act - set stats to 5, 4, 3, 3 (sum = 15)
    // Points calculation: 15 + (40 - 15) = 40
    await characterCreatorPage.setStats(5, 4, 3, 3);
    
    // Assert - verify points updated correctly (should be 40, not 0)
    await characterCreatorPage.verifyPointsLeft(40);
    
    // Act - change stats to 4, 4, 4, 3 (sum = 15)
    // Points calculation: 15 + (40 - 15) = 40
    await characterCreatorPage.setStats(4, 4, 4, 3);
    
    // Assert - verify points remain the same (sum is still 15)
    await characterCreatorPage.verifyPointsLeft(40);
    
    // Act - use all 15 points by setting values that sum to 55 (40 base + 15 points)
    // Example: 15, 15, 15, 10 (sum = 55)
    // Points calculation: 15 + (40 - 55) = 0
    await characterCreatorPage.setStats(15, 15, 15, 10);
    
    // Assert - verify all points are used (should be 0)
    await characterCreatorPage.verifyPointsLeft(0);
  });

  test('should allow adding character to party after filling form', async ({ characterCreatorPage }) => {
    // Arrange - page is already loaded in beforeEach
    await characterCreatorPage.verifyCharacterListEmpty();
    
    // Act - fill form and add character
    // Stats must use all 15 points (sum = 55, points = 0)
    // Example: 15, 15, 15, 10 (sum = 55, points = 15 + (40 - 55) = 0)
    await characterCreatorPage.fillName('Legolas');
    await characterCreatorPage.selectRace('Elf');
    await characterCreatorPage.selectClass('Zwiadowca');
    await characterCreatorPage.setStats(15, 15, 15, 10);
    await characterCreatorPage.addCharacter();
    
    // Check if popup appeared with error message - wait for popup to appear or character card to appear
    const popupError = await characterCreatorPage.checkPopupError();
    if (popupError && !popupError.includes('dodano')) {
      // If popup appeared with error, close it and fail test
      await characterCreatorPage.popupCloseButton.click();
      throw new Error(`Character creation failed with popup message: ${popupError}`);
    }
    
    // If popup was success message, close it
    if (popupError) {
      await characterCreatorPage.popupCloseButton.click();
    }
    
    // Assert - verify character was added
    await characterCreatorPage.waitForCharacterCard();
    const characterCount = await characterCreatorPage.getCharacterCount();
    expect(characterCount).toBe(1);
    await characterCreatorPage.verifyCharacterInList('Legolas');
  });

  test('should allow creating multiple characters up to 4', async ({ characterCreatorPage }) => {
    // Arrange - page is already loaded in beforeEach
    await characterCreatorPage.verifyCharacterListEmpty();
    
    // Act - create 4 characters
    // Each character must use all 15 points (sum = 55, points = 0)
    const characters = [
      { name: 'Aragorn', race: 'Człowiek' as const, class: 'Wojownik' as const, stats: [15, 15, 15, 10] }, // sum = 55
      { name: 'Legolas', race: 'Elf' as const, class: 'Zwiadowca' as const, stats: [10, 20, 15, 10] }, // sum = 55
      { name: 'Gimli', race: 'Krasnolud' as const, class: 'Wojownik' as const, stats: [20, 10, 15, 10] }, // sum = 55
      { name: 'Gandalf', race: 'Człowiek' as const, class: 'Czarodziej' as const, stats: [10, 10, 25, 10] } // sum = 55
    ];

    for (const char of characters) {
      await characterCreatorPage.fillName(char.name);
      await characterCreatorPage.selectRace(char.race);
      await characterCreatorPage.selectClass(char.class);
      await characterCreatorPage.setStats(char.stats[0], char.stats[1], char.stats[2], char.stats[3]);
      await characterCreatorPage.addCharacter();
      // Wait for character to be added before creating next one
      // Wait for popup to close (if appeared) or for character card to appear
      await characterCreatorPage.popup.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      // Also wait for character card container to be updated
      await characterCreatorPage.characterCardsContainer.waitFor({ state: 'attached' }).catch(() => {});
    }
    
    // Assert - verify all 4 characters were created
    const characterCount = await characterCreatorPage.getCharacterCount();
    expect(characterCount).toBe(4);
    
    for (const char of characters) {
      await characterCreatorPage.verifyCharacterInList(char.name);
    }
  });
});

