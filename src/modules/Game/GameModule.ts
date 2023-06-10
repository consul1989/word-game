import EventEmitter from "../EventEmitter";
import { mapWordsToState } from "../../helpers";
import { Game, Word } from "../../types";

export default class GameModel extends EventEmitter {
  private readonly initialWords: string[];
  private state: Game;

  constructor(initialWords: string[]) {
    super();

    this.initialWords = initialWords;
    this.state = {
      words: [],
      currentStep: 1,
    };

    this.generateWordsState();
  }

  public setState = (state: Game) => {
    this.state = state;
  };

  public getCurrentWord = (): Word => {
    const currentWordIndex = this.getCurrentStep() - 1;

    return this.state.words[currentWordIndex];
  };

  public getCurrentStep = (): number => {
    return this.state.currentStep;
  };

  public getWords = (): Word[] => {
    return this.state.words;
  };

  public incrementErrors = () => {
    const currentWord = this.getCurrentWord();

    this.state.words = this.state.words.map((word) =>
      word.id === currentWord.id
        ? {
            ...word,
            errors: currentWord.errors + 1,
          }
        : word
    );

    this.emit("change", { ...this.state });
  };

  public updateCurrentWord = (selectedLetter: string) => {
    const currentWord = this.getCurrentWord();

    this.addCompletedLetter({ currentWord, letter: selectedLetter });
    this.deleteMixedLetter({ currentWord, letter: selectedLetter });

    this.emit("change", { ...this.state });
  };

  public initNextStep = () => {
    if (this.getCurrentStep() >= this.getWords().length) {
      return;
    }

    this.setCurrentStep(this.state.currentStep + 1);

    this.emit("change", { ...this.state });
  };

  public initPrevStep = () => {
    if (this.getCurrentStep() <= 0) {
      return;
    }

    this.setCurrentStep(this.state.currentStep - 1);

    this.emit("change", { ...this.state });
  };

  public handleRestart = () => {
    this.resetValues();
    this.generateWordsState();
  };

  public resetValues = () => {
    this.setCurrentStep(1);

    this.emit("change", { ...this.state });
  };

  public fillCompletedLetters = () => {
    const currentWord = this.getCurrentWord();

    this.state.words = this.state.words.map((word) =>
      word.id === currentWord.id
        ? {
            ...word,
            completedLetters: word.initialWord.split(""),
            mixedLetters: [],
          }
        : word
    );

    this.emit("change", { ...this.state });
  };

  private generateWordsState = () => {
    this.state.words = mapWordsToState(this.initialWords);

    this.emit("change", { ...this.state });
  };

  private setCurrentStep = (value: number) => {
    this.state.currentStep = value;
  };

  private addCompletedLetter = ({
    currentWord,
    letter,
  }: {
    currentWord: Word;
    letter: string;
  }) => {
    this.state.words = this.state.words.map((word) =>
      word.id === currentWord.id
        ? {
            ...word,
            completedLetters: [...word.completedLetters, letter],
          }
        : word
    );
  };

  private deleteMixedLetter = ({
    currentWord,
    letter,
  }: {
    currentWord: Word;
    letter: string;
  }) => {
    const index = currentWord.mixedLetters.indexOf(letter);

    currentWord.mixedLetters.splice(index, 1);
  };
}
