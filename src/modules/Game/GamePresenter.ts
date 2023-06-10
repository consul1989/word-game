import GameModel from "./GameModule";
import GameView from "./GameView";
import FinalResultsView from "./FinalResultView";
import { clearState, loadState } from "../../services";
import {
  ARROW_LEFT,
  ARROW_RIGHT,
  INCORRECT_WORD_TIMER_DELAY,
  NUMBER_OF_ERRORS_PER_ROUND,
} from "../../settings";
import { Word } from "../../types";

export default class GamePresenter {
  private gameModel: GameModel;
  private gameView: GameView;
  private finalResultsView: FinalResultsView;

  constructor(
    gameModel: GameModel,
    gameView: GameView,
    finalResultsView: FinalResultsView
  ) {
    this.gameModel = gameModel;
    this.gameView = gameView;
    this.finalResultsView = finalResultsView;

    this.init();

    gameView.on("letterSubmit", this.handleLetterSubmit.bind(this));
    gameView.on(
      "continuePreviousGame",
      this.handleContinuePreviousGame.bind(this)
    );
    gameView.on("continueGameFromStart", this.continueFromStart.bind(this));
    finalResultsView.on("playAgain", this.handlePlayAgain.bind(this));
  }

  private init = () => {
    const uploadedState = loadState("letters");

    if (uploadedState) {
      this.gameView.showContinueButton();
    } else {
      this.showGameBoard();
    }
  };

  private showGameBoard = () => {
    const currentWord = this.gameModel.getCurrentWord();
    const currentStep = this.gameModel.getCurrentStep();
    const totalWords = this.gameModel.getWords();

    this.gameView.renderRound({
      currentWord,
      currentStep,
      totalSteps: totalWords.length,
    });
  };

  private handleLetterSubmit = (symbol: string) => {
    const letter = symbol.toLowerCase();
    const currentWord = this.gameModel.getCurrentWord();
    const currentStep = this.gameModel.getCurrentStep();

    if (letter === ARROW_RIGHT) {
      if (!currentWord.mixedLetters.length) {
        this.initNextStep();
      }

      return;
    }

    if (letter === ARROW_LEFT) {
      if (currentStep > 1) {
        this.gameModel.initPrevStep();
        this.showGameBoard();
      }

      return;
    }

    // prevent key handlers when navigating to previous steps
    if (!currentWord.mixedLetters.length) {
      return;
    }

    if (currentWord.mixedLetters.indexOf(letter) === -1) {
      this.handleWrongLetterSelect();

      return;
    }

    const nextCorrectLetter = this.getNextCorrectLetter();

    if (letter !== nextCorrectLetter) {
      this.handleWrongLetterSelect(letter);

      return;
    }

    this.gameModel.updateCurrentWord(letter);
    this.gameView.updateCurrentWord(letter);

    if (this.isCurrentWordComplete()) {
      this.initNextStep();
    }
  };

  private handleWrongLetterSelect = (letter?: string) => {
    this.gameModel.incrementErrors();

    if (letter) {
      this.gameView.handleIncorrectLetterSelect(letter);
    }

    const { errors } = this.gameModel.getCurrentWord();

    if (errors >= NUMBER_OF_ERRORS_PER_ROUND) {
      this.constructCorrectWord();
    }
  };

  private constructCorrectWord = () => {
    this.gameModel.fillCompletedLetters();
    this.showGameBoard();
    this.gameView.underlineWord();

    setTimeout(() => {
      this.initNextStep();
    }, INCORRECT_WORD_TIMER_DELAY);
  };

  private getNextCorrectLetter = () => {
    const currentWord = this.gameModel.getCurrentWord();

    return currentWord.initialWord[currentWord.completedLetters.length];
  };

  private isCurrentWordComplete = () => {
    const currentWord = this.gameModel.getCurrentWord();

    return (
      currentWord.completedLetters.length === currentWord.initialWord.length
    );
  };

  private initNextStep = () => {
    const currentStep = this.gameModel.getCurrentStep();
    const totalWords = this.gameModel.getWords();

    if (currentStep === totalWords.length) {
      setTimeout(() => {
        this.renderFinalResults();
      }, 500);

      return;
    }

    this.gameModel.initNextStep();
    this.showGameBoard();
  };

  private renderFinalResults = () => {
    const totalErrors = this.getTotalErrors();
    const numberOfWordsWithNoErrors = this.getWordsWithNoErrors().length;
    const wordsWithMostErrors = this.getWordsWithMostErrors();

    this.gameView.hideGameContainer();
    this.finalResultsView.render({
      totalErrors,
      numberOfWordsWithNoErrors,
      wordsWithMostErrors: wordsWithMostErrors,
    });
  };

  private getTotalErrors = (): number => {
    const totalWords = this.gameModel.getWords();

    return totalWords.reduce((acc, val) => acc + val.errors, 0);
  };

  private getWordsWithNoErrors = (): Array<Word> => {
    const totalWords = this.gameModel.getWords();

    return totalWords.filter((word) => !word.errors);
  };

  private getWordsWithMostErrors = (): Word[] => {
    const totalWords = this.gameModel.getWords();

    const maxErrorsWord = totalWords.reduce((acc, val) =>
      acc.errors > val.errors ? acc : val
    );

    if (maxErrorsWord.errors === 0) {
      return [];
    }

    return totalWords.filter((word) => word.errors === maxErrorsWord.errors);
  };

  private handlePlayAgain = () => {
    this.gameModel.handleRestart();
    this.gameView.showGameContainer();
    this.continueFromStart();
  };

  private handleContinuePreviousGame = () => {
    const uploadedState = loadState("letters");
    this.gameModel.setState(uploadedState);

    const currentStep = this.gameModel.getCurrentStep();
    const totalWords = this.gameModel.getWords();
    const currentWord = this.gameModel.getCurrentWord();

    if (currentStep === totalWords.length && !currentWord.mixedLetters.length) {
      this.renderFinalResults();

      return;
    }

    this.showGameBoard();
  };

  private continueFromStart = () => {
    clearState("letters");
    this.showGameBoard();
  };
}
