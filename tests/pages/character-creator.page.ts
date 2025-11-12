import { Page, Locator, expect } from '@playwright/test';

export class CharacterCreatorPage {
  readonly page: Page;

  // Locators
  readonly nameInput: Locator;
  readonly raceSelect: Locator;
  readonly classButtonWarrior: Locator;
  readonly classButtonRogue: Locator;
  readonly classButtonWizard: Locator;
  readonly classButtonRanger: Locator;
  readonly strengthField: Locator;
  readonly dexterityField: Locator;
  readonly energyField: Locator;
  readonly healthField: Locator;
  readonly generateButton: Locator;
  readonly characterCardsContainer: Locator;
  readonly characterCards: Locator;
  readonly pointsLeft: Locator;
  readonly popup: Locator;
  readonly popupCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators - using IDs for uniqueness
    this.nameInput = page.locator('#name');
    this.raceSelect = page.locator('#race');
    this.classButtonWarrior = page.locator('.class-option:has(img[alt="Wojownik"])');
    this.classButtonRogue = page.locator('.class-option:has(img[alt="Łotrzyk"])');
    this.classButtonWizard = page.locator('.class-option:has(img[alt="Czarodziej"])');
    this.classButtonRanger = page.locator('.class-option:has(img[alt="Zwiadowca"])');
    this.strengthField = page.locator('#strength');
    this.dexterityField = page.locator('#dexterity');
    this.energyField = page.locator('#energy');
    this.healthField = page.locator('#health');
    this.generateButton = page.locator('#generate-btn');
    this.characterCardsContainer = page.locator('#character-cards');
    this.characterCards = page.locator('#character-cards > div');
    this.pointsLeft = page.locator('#points-left');
    this.popup = page.locator('#popup');
    this.popupCloseButton = page.locator('#popup-close');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://howlingtesters.pl/party/');
  }

  async closeCookiePopup(): Promise<void> {
    const cookieAcceptButton = this.page.locator('button[data-cky-tag="accept-button"]');
    await cookieAcceptButton.waitFor({ state: 'visible', timeout: 5000 });
    await cookieAcceptButton.click();
    await cookieAcceptButton.waitFor({ state: 'hidden', timeout: 3000 });
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async selectRace(race: 'Człowiek' | 'Elf' | 'Krasnolud' | 'Ork'): Promise<void> {
    await this.raceSelect.selectOption(race);
  }

  async selectClass(characterClass: 'Wojownik' | 'Łotrzyk' | 'Czarodziej' | 'Zwiadowca'): Promise<void> {
    let selectedButton: Locator;
    switch (characterClass) {
      case 'Wojownik':
        selectedButton = this.classButtonWarrior;
        break;
      case 'Łotrzyk':
        selectedButton = this.classButtonRogue;
        break;
      case 'Czarodziej':
        selectedButton = this.classButtonWizard;
        break;
      case 'Zwiadowca':
        selectedButton = this.classButtonRanger;
        break;
    }
    await selectedButton!.click();
    await selectedButton!.waitFor({ state: 'visible' });
    await this.page.waitForSelector('.class-option.selected', { timeout: 3000 });
  }

  async setStats(strength: number, dexterity: number, energy: number, health: number): Promise<void> {
    await this.strengthField.fill(strength.toString());
    await this.dexterityField.fill(dexterity.toString());
    await this.energyField.fill(energy.toString());
    await this.healthField.fill(health.toString());
    await this.pointsLeft.waitFor({ state: 'visible' });
  }

  async addCharacter(): Promise<void> {
    await this.generateButton.click();
  }

  async getCharacterCount(): Promise<number> {
    await this.characterCardsContainer.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    return await this.characterCards.count();
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  async waitForCharacterCard(): Promise<void> {
    await this.characterCardsContainer.waitFor({ state: 'attached' });
    await this.page.waitForSelector('#character-cards > div', { timeout: 5000 });
  }

  async verifyCharacterInList(characterName: string): Promise<void> {
    await this.characterCardsContainer.waitFor({ state: 'attached' });
    const hasText = await this.characterCardsContainer.textContent();
    expect(hasText).toContain(characterName);
  }

  async verifyCharacterListEmpty(): Promise<void> {
    const count = await this.getCharacterCount();
    expect(count).toBe(0);
  }
}

