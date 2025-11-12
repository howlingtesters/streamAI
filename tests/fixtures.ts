import { test as base } from '@playwright/test';
import { CharacterCreatorPage } from './pages/character-creator.page';

type PageObjects = {
  characterCreatorPage: CharacterCreatorPage;
};

export const test = base.extend<PageObjects>({
  characterCreatorPage: async ({ page }, use) => {
    const characterCreatorPage = new CharacterCreatorPage(page);
    await use(characterCreatorPage);
  },
});

export { expect } from '@playwright/test';