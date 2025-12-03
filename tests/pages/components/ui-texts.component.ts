import { Page, Locator, expect } from '@playwright/test';
import { CharacterFormComponent } from './character-form.component';

export class UiTextsComponent {
  readonly page: Page;
  readonly form: CharacterFormComponent;

  // UI Text Locators - Form Section
  readonly mainTitle: Locator;
  readonly mainDescription: Locator;
  readonly formTitle: Locator;
  readonly nameLabel: Locator;
  readonly raceLabel: Locator;
  readonly classHeading: Locator;
  readonly classOptionLabels: Locator;
  readonly statsHeading: Locator;
  readonly strengthLabel: Locator;
  readonly dexterityLabel: Locator;
  readonly energyLabel: Locator;
  readonly healthLabel: Locator;

  // UI Text Locators - Character List Section
  readonly characterListTitle: Locator;
  readonly characterCardName: Locator;
  readonly characterCardRace: Locator;
  readonly characterCardClass: Locator;
  readonly characterCardStats: Locator;
  readonly characterDeleteButton: Locator;

  constructor(page: Page, form: CharacterFormComponent) {
    this.page = page;
    this.form = form;

    // Form Section
    this.mainTitle = page.locator('h1');
    this.mainDescription = page.locator('h1 + p');
    this.formTitle = page.locator('h2:has-text("Stwórz swoją postać")');
    this.nameLabel = page.locator('label[for="name"]');
    this.raceLabel = page.locator('label[for="race"]');
    this.classHeading = page.locator('h3:has-text("Wybierz klasę:")');
    this.classOptionLabels = page.locator('.class-option p');
    this.statsHeading = page.locator('h3:has-text("Cechy postaci")');
    this.strengthLabel = page.locator('label[for="strength"]');
    this.dexterityLabel = page.locator('label[for="dexterity"]');
    this.energyLabel = page.locator('label[for="energy"]');
    this.healthLabel = page.locator('label[for="health"]');

    // Character List Section
    this.characterListTitle = page.locator('h2:has-text("Twoje postacie")');
    this.characterCardName = page.locator('#character-cards h4');
    this.characterCardRace = page.locator('#character-cards p:has-text("Rasa:")');
    this.characterCardClass = page.locator('#character-cards p:has-text("Klasa:")');
    this.characterCardStats = page.locator('#character-cards ul li');
    this.characterDeleteButton = page.locator('#character-cards button:has-text("Usuń")');
  }

  async verifyFormTextsVisible(): Promise<void> {
    await expect(this.mainTitle).toHaveText('Stwórz drużynę');
    await expect(this.mainDescription).toContainText('Wybierz imiona, rasy i klasy');
    await expect(this.formTitle).toHaveText('Stwórz swoją postać');
    await expect(this.nameLabel).toHaveText('Imię postaci:');
    await expect(this.form.nameInput).toHaveAttribute('placeholder', 'Wpisz imię...');
    await expect(this.raceLabel).toHaveText('Rasa:');
    await expect(this.classHeading).toHaveText('Wybierz klasę:');
    await expect(this.statsHeading).toHaveText('Cechy postaci');
    await expect(this.form.pointsLeft).toContainText('Punkty do wydania:');
    await expect(this.form.generateButton).toHaveText('Dodaj postać');
  }

  async verifyRaceOptions(): Promise<void> {
    const options = ['Człowiek', 'Elf', 'Krasnolud', 'Ork'];
    for (const option of options) {
      await expect(this.form.raceSelect.locator(`option:has-text("${option}")`)).toBeVisible();
    }
  }

  async verifyClassOptions(): Promise<void> {
    const classes = ['Wojownik', 'Łotrzyk', 'Czarodziej', 'Zwiadowca'];
    for (const className of classes) {
      await expect(this.classOptionLabels.filter({ hasText: className })).toBeVisible();
    }
  }

  async verifyStatLabels(): Promise<void> {
    await expect(this.strengthLabel).toHaveText('Siła:');
    await expect(this.dexterityLabel).toHaveText('Spryt:');
    await expect(this.energyLabel).toHaveText('Energia:');
    await expect(this.healthLabel).toHaveText('Zdrowie:');
  }

  async verifyCharacterCardTexts(
    name: string,
    race: string,
    characterClass: string,
    stats: { strength: number; dexterity: number; energy: number; health: number }
  ): Promise<void> {
    await expect(this.characterListTitle).toHaveText('Twoje postacie');
    await expect(this.characterCardName.first()).toHaveText(name);
    await expect(this.characterCardRace.first()).toHaveText(`Rasa: ${race}`);
    await expect(this.characterCardClass.first()).toHaveText(`Klasa: ${characterClass}`);
    await expect(this.characterCardStats.nth(0)).toHaveText(`Siła: ${stats.strength}`);
    await expect(this.characterCardStats.nth(1)).toHaveText(`Spryt: ${stats.dexterity}`);
    await expect(this.characterCardStats.nth(2)).toHaveText(`Energia: ${stats.energy}`);
    await expect(this.characterCardStats.nth(3)).toHaveText(`Zdrowie: ${stats.health}`);
    await expect(this.characterDeleteButton.first()).toHaveText('Usuń');
  }
}

