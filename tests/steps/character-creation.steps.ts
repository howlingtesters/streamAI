import { CharacterCreatorPage } from '../pages/character-creator.page';

export interface CharacterData {
  name: string;
  race: 'Człowiek' | 'Elf' | 'Krasnolud' | 'Ork';
  class: 'Wojownik' | 'Łotrzyk' | 'Czarodziej' | 'Zwiadowca';
  stats: {
    strength: number;
    dexterity: number;
    energy: number;
    health: number;
  };
}

export async function addCharacterToList(
  characterCreatorPage: CharacterCreatorPage,
  character: CharacterData
): Promise<void> {
  await characterCreatorPage.fillName(character.name);
  await characterCreatorPage.selectRace(character.race);
  await characterCreatorPage.selectClass(character.class);
  await characterCreatorPage.setStats(
    character.stats.strength,
    character.stats.dexterity,
    character.stats.energy,
    character.stats.health
  );
  await characterCreatorPage.addCharacter();
  await characterCreatorPage.waitForCharacterCard();
}

