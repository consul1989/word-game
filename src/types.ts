export type Game = {
  words: Word[];
  currentStep: number;
};

export type Word = {
  id: number;
  initialWord: string;
  completedLetters: string[];
  mixedLetters: string[];
  errors: number;
};

export type FinalResultData = {
  totalErrors: number;
  numberOfWordsWithNoErrors: number;
  wordsWithMostErrors: Word[];
};
