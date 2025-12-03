import { CharacterData } from '../steps/character-creation.steps';

export const legolas: CharacterData = {
  name: 'Legolas',
  race: 'Elf',
  class: 'Zwiadowca',
  stats: { strength: 15, dexterity: 15, energy: 15, health: 10 }
};

export const gimli: CharacterData = {
  name: 'Gimli',
  race: 'Krasnolud',
  class: 'Wojownik',
  stats: { strength: 15, dexterity: 10, energy: 15, health: 15 }
};

export const gandalf: CharacterData = {
  name: 'Gandalf',
  race: 'Człowiek',
  class: 'Czarodziej',
  stats: { strength: 10, dexterity: 15, energy: 15, health: 15 }
};

export const aragorn: CharacterData = {
  name: 'Aragorn',
  race: 'Ork',
  class: 'Łotrzyk',
  stats: { strength: 15, dexterity: 15, energy: 10, health: 15 }
};

export const fourCharacters: CharacterData[] = [
  legolas,
  gimli,
  gandalf,
  aragorn
];

