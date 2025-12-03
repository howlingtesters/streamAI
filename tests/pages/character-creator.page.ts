import { Page } from '@playwright/test';
import { CharacterFormComponent } from './components/character-form.component';
import { CharacterListComponent } from './components/character-list.component';
import { UiTextsComponent } from './components/ui-texts.component';

export class CharacterCreatorPage {
  readonly page: Page;
  readonly form: CharacterFormComponent;
  readonly list: CharacterListComponent;
  readonly texts: UiTextsComponent;

  constructor(page: Page) {
    this.page = page;
    this.form = new CharacterFormComponent(page);
    this.list = new CharacterListComponent(page);
    this.texts = new UiTextsComponent(page, this.form);
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

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  // Delegated methods for backward compatibility

  async fillName(name: string): Promise<void> {
    await this.form.fillName(name);
  }

  async selectRace(race: 'Człowiek' | 'Elf' | 'Krasnolud' | 'Ork'): Promise<void> {
    await this.form.selectRace(race);
  }

  async selectClass(characterClass: 'Wojownik' | 'Łotrzyk' | 'Czarodziej' | 'Zwiadowca'): Promise<void> {
    await this.form.selectClass(characterClass);
  }

  async setStats(strength: number, dexterity: number, energy: number, health: number): Promise<void> {
    await this.form.setStats(strength, dexterity, energy, health);
  }

  async addCharacter(): Promise<void> {
    await this.form.addCharacter();
  }

  async getNameInputValue(): Promise<string> {
    return await this.form.getNameInputValue();
  }

  async getCharacterCount(): Promise<number> {
    return await this.list.getCharacterCount();
  }

  async waitForCharacterCard(): Promise<void> {
    await this.list.waitForCharacterCard();
  }

  async verifyCharacterInList(characterName: string): Promise<void> {
    await this.list.verifyCharacterInList(characterName);
  }

  async verifyCharacterListEmpty(): Promise<void> {
    await this.list.verifyCharacterListEmpty();
  }

  async verifyFormTextsVisible(): Promise<void> {
    await this.texts.verifyFormTextsVisible();
  }

  async verifyRaceOptions(): Promise<void> {
    await this.texts.verifyRaceOptions();
  }

  async verifyClassOptions(): Promise<void> {
    await this.texts.verifyClassOptions();
  }

  async verifyStatLabels(): Promise<void> {
    await this.texts.verifyStatLabels();
  }

  async verifyCharacterCardTexts(
    name: string,
    race: string,
    characterClass: string,
    stats: { strength: number; dexterity: number; energy: number; health: number }
  ): Promise<void> {
    await this.texts.verifyCharacterCardTexts(name, race, characterClass, stats);
  }
}
