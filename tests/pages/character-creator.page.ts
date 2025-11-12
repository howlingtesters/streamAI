import { Page, expect, Locator } from '@playwright/test';

export class CharacterCreatorPage {
  readonly page: Page;

  // Locators
  readonly h1: Locator;
  readonly h2CharacterCreator: Locator;
  readonly characterListTitle: Locator;
  readonly nameLabel: Locator;
  readonly nameInput: Locator;
  readonly raceLabel: Locator;
  readonly raceSelect: Locator;
  readonly raceOptionHuman: Locator;
  readonly raceOptionElf: Locator;
  readonly raceOptionDwarf: Locator;
  readonly raceOptionOrc: Locator;
  readonly classHeading: Locator;
  readonly characterCreatorContainer: Locator;
  readonly strengthField: Locator;
  readonly dexterityField: Locator;
  readonly energyField: Locator;
  readonly healthField: Locator;
  readonly generateButton: Locator;
  readonly characterList: Locator;
  readonly pointsLeft: Locator;
  readonly classButtonWarrior: Locator;
  readonly classButtonRogue: Locator;
  readonly classButtonWizard: Locator;
  readonly classButtonRanger: Locator;
  readonly characterCards: Locator;
  readonly characterCardsContainer: Locator;
  readonly popup: Locator;
  readonly popupCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.h1 = page.locator('h1');
    this.h2CharacterCreator = page.locator('#character-creator > h2');
    this.characterListTitle = page.locator('#character-list-title');
    this.nameLabel = page.locator('label[for="name"]');
    this.nameInput = page.locator('#name');
    this.raceLabel = page.locator('label[for="race"]');
    this.raceSelect = page.locator('#race');
    this.raceOptionHuman = page.locator('#race option[value="Człowiek"]');
    this.raceOptionElf = page.locator('#race option[value="Elf"]');
    this.raceOptionDwarf = page.locator('#race option[value="Krasnolud"]');
    this.raceOptionOrc = page.locator('#race option[value="Ork"]');
    this.classHeading = page.locator('#character-creator #race + h3');
    this.characterCreatorContainer = page.locator('#character-creator');
    this.strengthField = page.locator('#strength');
    this.dexterityField = page.locator('#dexterity');
    this.energyField = page.locator('#energy');
    this.healthField = page.locator('#health');
    this.generateButton = page.locator('#generate-btn');
    this.characterList = page.locator('#character-list');
    this.pointsLeft = page.locator('#points-left');
    this.classButtonWarrior = page.locator('#character-creator .class-select .class-option img[alt="Wojownik"]').locator('..');
    this.classButtonRogue = page.locator('#character-creator .class-select .class-option img[alt="Łotrzyk"]').locator('..');
    this.classButtonWizard = page.locator('#character-creator .class-select .class-option img[alt="Czarodziej"]').locator('..');
    this.classButtonRanger = page.locator('#character-creator .class-select .class-option img[alt="Zwiadowca"]').locator('..');
    this.characterCardsContainer = page.locator('#character-cards');
    this.characterCards = page.locator('#character-cards > div, #character-cards .character-card');
    this.popup = page.locator('#popup');
    this.popupCloseButton = page.locator('#popup button');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://howlingtesters.pl/party/');
    // Accept cookies if popup appears
    const cookieAcceptButton = this.page.locator('button').filter({ hasText: 'Accept All' });
    try {
      if (await cookieAcceptButton.isVisible({ timeout: 2000 })) {
        await cookieAcceptButton.click();
        // Wait for cookie popup to disappear
        await this.page.locator('button').filter({ hasText: 'Accept All' }).waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      }
    } catch {
      // Cookie popup not visible, continue
    }
  }

  // Verification methods
  async verifyPageHeaders(): Promise<void> {
    await expect(this.h1).toContainText('Stwórz drużynę'); // tylko 1 H1 na stronie
    await expect(this.h2CharacterCreator).toContainText('Stwórz swoją postać'); // unikalny przez direct child selector
    await expect(this.characterListTitle).toContainText('Twoje postacie'); // unikalny przez ID
  }

  async verifyFormFieldsAndLabels(): Promise<void> {
    await expect(this.nameLabel).toContainText('Imię postaci');
    await expect(this.nameInput).toBeVisible();
    await expect(this.raceLabel).toContainText('Rasa');
    await expect(this.raceSelect).toBeVisible();
  }

  async verifyRaceOptions(): Promise<void> {
    await expect(this.raceOptionHuman).toContainText('Człowiek');
    await expect(this.raceOptionElf).toContainText('Elf');
    await expect(this.raceOptionDwarf).toContainText('Krasnolud');
    await expect(this.raceOptionOrc).toContainText('Ork');
  }

  async verifyCharacterClassSelection(): Promise<void> {
    await expect(this.classHeading).toBeVisible(); // unikalny przez sibling selector
    await expect(this.characterCreatorContainer).toContainText('Wojownik');
    await expect(this.characterCreatorContainer).toContainText('Łotrzyk');
    await expect(this.characterCreatorContainer).toContainText('Czarodziej');
    await expect(this.characterCreatorContainer).toContainText('Zwiadowca');
  }

  async verifyCharacterStatsFields(): Promise<void> {
    await expect(this.strengthField).toBeVisible();
    await expect(this.dexterityField).toBeVisible();
    await expect(this.energyField).toBeVisible();
    await expect(this.healthField).toBeVisible();
  }

  async verifyActionButtonsAndSections(): Promise<void> {
    await expect(this.generateButton).toContainText('Dodaj postać');
    await expect(this.characterList).toBeAttached(); // element istnieje w DOM
    await expect(this.pointsLeft).toBeVisible();
  }

  // Interaction methods
  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async selectRace(race: 'Człowiek' | 'Elf' | 'Krasnolud' | 'Ork'): Promise<void> {
    await this.raceSelect.selectOption(race);
  }

  async selectClass(characterClass: 'Wojownik' | 'Łotrzyk' | 'Czarodziej' | 'Zwiadowca'): Promise<void> {
    // Close popup if it appears before clicking
    const popup = this.page.locator('#popup');
    const isPopupVisible = await popup.isVisible().catch(() => false);
    if (isPopupVisible) {
      const closeButton = popup.locator('button');
      if (await closeButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeButton.click();
        // Wait for popup to close
        await popup.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
      }
    }
    
    let selectedButton: Locator;
    switch (characterClass) {
      case 'Wojownik':
        selectedButton = this.classButtonWarrior;
        await selectedButton.click({ force: true });
        break;
      case 'Łotrzyk':
        selectedButton = this.classButtonRogue;
        await selectedButton.click({ force: true });
        break;
      case 'Czarodziej':
        selectedButton = this.classButtonWizard;
        await selectedButton.click({ force: true });
        break;
      case 'Zwiadowca':
        selectedButton = this.classButtonRanger;
        await selectedButton.click({ force: true });
        break;
    }
    // Wait for class button to be stable (clicked state)
    await expect(selectedButton!).toBeVisible();
  }

  async setStats(strength: number, dexterity: number, energy: number, health: number): Promise<void> {
    await this.strengthField.fill(strength.toString());
    await this.dexterityField.fill(dexterity.toString());
    await this.energyField.fill(energy.toString());
    await this.healthField.fill(health.toString());
    // Wait for points calculation to update - wait for pointsLeft to be visible and contain a number
    await expect(this.pointsLeft).toBeVisible();
    // Points will update, wait for it to contain a valid number (not empty)
    await expect(this.pointsLeft).not.toHaveText('');
  }

  async addCharacter(): Promise<void> {
    await this.generateButton.click();
    // Wait for popup to appear (either success or error)
    const popup = this.page.locator('#popup');
    // Wait for popup to appear or for character card to appear (success case)
    try {
      await popup.waitFor({ state: 'visible', timeout: 3000 });
      const closeButton = popup.locator('button');
      if (await closeButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeButton.click();
        // Wait for popup to close
        await popup.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
      }
    } catch {
      // Popup didn't appear, might be success case - character card should appear
      // This will be handled by waitForCharacterCard in the test
    }
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  // Verification methods for character creation
  async getCharacterCount(): Promise<number> {
    // Wait for cards container to be ready
    await this.characterCardsContainer.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    // Wait for at least one card to appear or for container to be empty (0 cards)
    // If container is empty, count will be 0, otherwise wait for cards to load
    const count = await this.characterCards.count();
    if (count > 0) {
      // Wait for first card to be visible to ensure they're loaded
      await this.characterCards.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    }
    return await this.characterCards.count();
  }

  async waitForCharacterCard(): Promise<void> {
    // Wait for at least one character card to appear
    // Try multiple selectors as cards might be rendered differently
    try {
      await this.characterCards.first().waitFor({ state: 'visible', timeout: 3000 });
    } catch {
      // Try alternative selector
      const altCard = this.page.locator('#character-cards .character-card');
      await altCard.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    }
  }

  async checkPopupError(): Promise<string | null> {
    const isVisible = await this.popup.isVisible().catch(() => false);
    if (isVisible) {
      const popupText = await this.popup.textContent();
      return popupText?.trim() || null;
    }
    return null;
  }

  async verifyCharacterInList(characterName: string): Promise<void> {
    await expect(this.characterCardsContainer).toContainText(characterName);
  }

  async verifyDefaultName(): Promise<void> {
    const defaultValue = await this.nameInput.inputValue();
    // Default value is empty, user can enter name or it will use "Bohater" when adding character
    expect(defaultValue).toBe('');
  }

  async verifyNameFieldIsEditable(): Promise<void> {
    await expect(this.nameInput).toBeEditable();
    await expect(this.nameInput).toBeVisible();
  }

  async verifyPointsLeft(expectedPoints: number): Promise<void> {
    await expect(this.pointsLeft).toContainText(expectedPoints.toString());
  }

  async verifyCharacterListEmpty(): Promise<void> {
    const count = await this.getCharacterCount();
    expect(count).toBe(0);
  }
}

