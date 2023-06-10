import { NUMBER_OF_WORDS_PER_GAME } from "../settings";
import { Word } from "../types";

export const shuffle = <T>(array: Array<T>): Array<T> => {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

export const saveToLocalStorage = <T>({
  key,
  value,
}: {
  key: string;
  value: T;
}) => {
  const string = JSON.stringify(value);

  localStorage.setItem(key, string);
};

export const loadFromLocalStorage = (value: string) => {
  const string = localStorage.getItem(value);

  return JSON.parse(string);
};

export const clearLocalStorageValue = (value: string) => {
  localStorage.removeItem(value);
};

export const mapWordsToState = (initialArray: string[]): Word[] => {
  const shuffledListOfWords = shuffle(initialArray);
  const wordsForGame = shuffledListOfWords.slice(0, NUMBER_OF_WORDS_PER_GAME);

  return wordsForGame.map((word, index) => {
    const lowerCasedWord = word.toLowerCase();

    return {
      id: index + 1,
      initialWord: lowerCasedWord,
      completedLetters: [],
      mixedLetters: shuffle(lowerCasedWord.split("")),
      errors: 0,
    };
  });
};
