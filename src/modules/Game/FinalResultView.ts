import EventEmitter from "../EventEmitter";
import { FinalResultData } from "../../types";

export default class FinalResultsView extends EventEmitter {
  private gameOverContainer: HTMLElement;
  private totalErrorsContainer: HTMLElement;
  private numberOfWordsWithNoErrorsContainer: HTMLElement;
  private wordsWithMostErrorsContainer: HTMLElement;
  private playAgainButton: HTMLElement;

  constructor() {
    super();

    this.gameOverContainer = document.getElementById("gameOver");
    this.totalErrorsContainer = document.getElementById("totalErrors");
    this.numberOfWordsWithNoErrorsContainer = document.getElementById(
      "numberOfWordsWithNoErrors"
    );
    this.wordsWithMostErrorsContainer = document.getElementById(
      "wordsWithMostErrors"
    );
    this.playAgainButton = document.getElementById("playAgainButton");
  }

  public render = ({
    totalErrors,
    numberOfWordsWithNoErrors,
    wordsWithMostErrors,
  }: FinalResultData) => {
    this.gameOverContainer.classList.remove("hidden");

    this.totalErrorsContainer.textContent = totalErrors.toString();
    this.numberOfWordsWithNoErrorsContainer.textContent =
      numberOfWordsWithNoErrors.toString();

    this.wordsWithMostErrorsContainer.innerHTML = "";

    if (!wordsWithMostErrors.length) {
      const block = document.createElement("li");
      block.textContent = "0";

      this.wordsWithMostErrorsContainer.append(block);
    } else {
      wordsWithMostErrors.forEach((word) => {
        const block = document.createElement("li");
        block.classList.add("incorrectWord");
        block.textContent = word.initialWord;

        this.wordsWithMostErrorsContainer.append(block);
      });
    }

    this.playAgainButton.addEventListener("click", this.playAgain);
  };

  public playAgain = () => {
    this.gameOverContainer.classList.add("hidden");

    this.emit("playAgain");
  };
}
