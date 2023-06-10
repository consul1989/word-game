import GameModel from "./modules/Game/GameModule";
import GamePresenter from "./modules/Game/GamePresenter";
import GameView from "./modules/Game/GameView";
import FinalResultsView from "./modules/Game/FinalResultView";
import { saveState } from "./services";
import { initialWords } from "./settings";

const gameModel = new GameModel(initialWords);
gameModel.on("change", (data: any) => saveState("letters", { ...data }));

const gameView = new GameView();
const finalResultsView = new FinalResultsView();
const gamePresenter = new GamePresenter(
  gameModel,
  gameView,
  finalResultsView
);

if (module.hot) {
    module.hot.accept();
}
