import { test, expect } from './fixtures';
import { addCharacterToList } from './steps/character-creation.steps';
import { legolas, fourCharacters } from './data/character-data';

test.describe('User Story #1: Character Creation', () => {
  test('should have default name "Bohater"', async ({ characterCreatorPage }) => {
    // Arrange
    await characterCreatorPage.goto();
    await characterCreatorPage.closeCookiePopup();

    // Act & Assert - verify default name value
    const defaultName = await characterCreatorPage.getNameInputValue();
    expect(defaultName).toBe('Bohater');
  });

  test('should allow adding character to party after filling form', async ({ characterCreatorPage }) => {
    // Arrange
    await characterCreatorPage.goto();
    await characterCreatorPage.closeCookiePopup();

    // Act - fill form and add character
    // Stats must use all 15 points (sum = 55, points = 0)
    await addCharacterToList(characterCreatorPage, legolas);

    // Assert - verify character was added (matches test name)
    const characterCount = await characterCreatorPage.getCharacterCount();
    expect(characterCount).toBe(1);
    await characterCreatorPage.verifyCharacterInList('Legolas');
  });

  test('should allow creating multiple characters up to 4', async ({ characterCreatorPage }) => {
    // Arrange
    await characterCreatorPage.goto();
    await characterCreatorPage.closeCookiePopup();

    // Act - create 4 characters using steps to avoid duplication

    for (let i = 0; i < fourCharacters.length; i++) {
      const character = fourCharacters[i];
      await test.step(`Create character ${i + 1}: ${character.name}`, async () => {
        await addCharacterToList(characterCreatorPage, character);
      });

      // Assert - verify character count after each addition
      const characterCount = await characterCreatorPage.getCharacterCount();
      expect(characterCount).toBe(i + 1);
      await characterCreatorPage.verifyCharacterInList(character.name);
    }
  });

  test('should display all main texts correctly before and after adding character', async ({ characterCreatorPage }) => {
    // Arrange
    await characterCreatorPage.goto();
    await characterCreatorPage.closeCookiePopup();

    // Assert - verify ALL texts BEFORE adding character (13 elements)
    await characterCreatorPage.verifyFormTextsVisible();
    await characterCreatorPage.verifyRaceOptions();
    await characterCreatorPage.verifyClassOptions();
    await characterCreatorPage.verifyStatLabels();

    // Act - add character
    await addCharacterToList(characterCreatorPage, legolas);

    // Assert - verify texts AFTER adding character
    await characterCreatorPage.verifyFormTextsVisible();
    await characterCreatorPage.verifyCharacterCardTexts(
      legolas.name,
      legolas.race,
      legolas.class,
      legolas.stats
    );
  });
});

