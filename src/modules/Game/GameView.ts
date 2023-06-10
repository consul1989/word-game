import EventEmitter from "../EventEmitter";
import { NUMBER_OF_ERRORS_PER_ROUND } from "../../settings";
import { Word } from "../../types";

import "../../styles/index.css";

export default class GameView extends EventEmitter {
  private currentStepContainer: HTMLElement;
  private totalStepsContainer: HTMLElement;
  private gameContainer: HTMLElement;
  private completedLettersContainer: HTMLElement;
  private mixedLettersContainer: HTMLElement;
  private continueContainer: HTMLElement;
  private continueButtonAgree: HTMLElement;
  private continueButtonDecline: HTMLElement;

  constructor() {
    super();

    this.currentStepContainer = document.getElementById("current_step");
    this.totalStepsContainer = document.getElementById("total_steps");
    this.gameContainer = document.getElementById("game");
    this.completedLettersContainer = document.getElementById(
      "letters-container-completed"
    );
    this.mixedLettersContainer = document.getElementById(
      "letters-container-mixed"
    );

    this.continueContainer = document.getElementById("continueContainer");
    this.continueButtonAgree = document.getElementById("continueButtonAgree");
    this.continueButtonDecline = document.getElementById(
      "continueButtonDecline"
    );

    this.init();
  }

  private init = () => {
    document.addEventListener("keydown", this.keyDown);
  };

  public renderRound = ({
    currentWord,
    currentStep,
    totalSteps,
  }: {
    currentWord: Word;
    currentStep: number;
    totalSteps: number;
  }) => {
    this.currentStepContainer.textContent = currentStep.toString();
    this.totalStepsContainer.textContent = totalSteps.toString();

    this.renderCompletedWordContainer(currentWord);
    this.renderMixedWordContainer(currentWord.mixedLetters);
  };

  private renderCompletedWordContainer = ({
    completedLetters,
    errors,
  }: Word) => {
    this.completedLettersContainer.innerHTML = "";

    for (let i = 0; i < completedLetters.length; i++) {
      const block = this.createLetter({
        textContent: completedLetters[i],
        hasError: errors >= NUMBER_OF_ERRORS_PER_ROUND,
      });

      this.completedLettersContainer.append(block);
    }
  };

  private renderMixedWordContainer = (mixedLetters: string[]) => {
    this.mixedLettersContainer.innerHTML = "";

    for (let i = 0; i < mixedLetters.length; i++) {
      const block = this.createLetter({
        textContent: mixedLetters[i],
        clickListener: this.handleLetterClick,
      });

      this.mixedLettersContainer.append(block);
    }
  };

  private createLetter = ({
    textContent,
    clickListener,
    hasError,
  }: {
    textContent: string;
    clickListener?: (event: Event) => void;
    hasError?: boolean;
  }) => {
    const block = document.createElement("li");
    block.classList.add("letter");

    if (hasError) {
      block.classList.add("letter-error");
    }

    block.dataset.value = textContent;
    block.append(textContent);

    if (clickListener) {
      block.addEventListener("click", clickListener);
    }

    return block;
  };

  private handleLetterClick = ({ target }: Event) => {
    const element = target as HTMLElement;

    this.emit("letterSubmit", element.dataset.value);
  };

  public handleIncorrectLetterSelect = (letter: string) => {
    const selectedLetter = this.mixedLettersContainer.querySelector(
      `[data-value='${letter}']`
    );

    selectedLetter.classList.add("letter-error");

    setTimeout(() => {
      selectedLetter.classList.remove("letter-error");
    }, 300);
  };

  public updateCurrentWord = (letter: string) => {
    this.addItemToCompletedLetters(letter);
    this.deleteLetter(letter);
  };

  private addItemToCompletedLetters = (letter: string) => {
    const block = this.createLetter({ textContent: letter });

    this.completedLettersContainer.append(block);
  };

  private deleteLetter = (letter: string) => {
    const selectedLetter = this.mixedLettersContainer.querySelector(
      `[data-value='${letter}']`
    );

    selectedLetter.removeEventListener("click", this.handleLetterClick);
    this.mixedLettersContainer.removeChild(selectedLetter);
  };

  public hideGameContainer = () => {
    this.gameContainer.classList.add("hidden");

    this.detachEventHandlers();
  };

  public showGameContainer = () => {
    this.gameContainer.classList.remove("hidden");

    this.init();
  };

  public underlineWord = () => {
    const listItems =
      this.completedLettersContainer.querySelectorAll(".letter");

    listItems.forEach((list) => list.classList.add("letter-error"));
  };

  public showContinueButton = () => {
    this.continueContainer.classList.remove("hidden");
    this.gameContainer.classList.add("hidden");

    this.initContinueContainerHandlers();
  };

  private initContinueContainerHandlers = () => {
    this.continueButtonAgree.addEventListener(
      "click",
      this.handleContinuePreviousGame
    );
    this.continueButtonDecline.addEventListener(
      "click",
      this.handleContinueFromStart
    );
  };

  private removeContinueContainerHandler = () => {
    this.continueButtonAgree.removeEventListener(
      "click",
      this.handleContinuePreviousGame
    );
    this.continueButtonDecline.removeEventListener(
      "click",
      this.handleContinueFromStart
    );
  };

  private handleContinuePreviousGame = () => {
    this.continueContainer.classList.add("hidden");
    this.gameContainer.classList.remove("hidden");

    this.removeContinueContainerHandler();

    this.emit("continuePreviousGame");
  };

  private handleContinueFromStart = () => {
    this.continueContainer.classList.add("hidden");
    this.gameContainer.classList.remove("hidden");

    this.emit("continueGameFromStart");
  };

  private detachEventHandlers = () => {
    document.removeEventListener("keydown", this.keyDown);
  };

  private keyDown = (event: KeyboardEvent) => {
    this.emit("letterSubmit", event.key);
  };
}
