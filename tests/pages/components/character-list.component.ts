import { Page, Locator, expect } from '@playwright/test';

export class CharacterListComponent {
  readonly page: Page;

  // List Locators
  readonly characterCardsContainer: Locator;
  readonly characterCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.characterCardsContainer = page.locator('#character-cards');
    this.characterCards = page.locator('#character-cards > div');
  }

  async getCharacterCount(): Promise<number> {
    await this.characterCardsContainer.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    return await this.characterCards.count();
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

