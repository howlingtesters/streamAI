import { Page, Locator } from '@playwright/test';

export class CharacterFormComponent {
  readonly page: Page;

  // Form Locators
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
  readonly pointsLeft: Locator;
  readonly pointsHeading: Locator;
  readonly popup: Locator;
  readonly popupCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

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
    this.pointsLeft = page.locator('#points-left');
    this.pointsHeading = page.locator('h2:has(#points-left)');
    this.popup = page.locator('#popup');
    this.popupCloseButton = page.locator('#popup-close');
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

  async getNameInputValue(): Promise<string> {
    return await this.nameInput.inputValue();
  }
}

