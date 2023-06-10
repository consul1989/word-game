import GameModel from "./modules/Game/GameModule";
import GameController from "./modules/Game/GameController";
import GameView from "./modules/Game/GameView";
import FinalResultsView from "./modules/Game/FinalResultView";
import { saveState } from "./services";
import { initialWords } from "./settings";

const gameModel = new GameModel(initialWords);
gameModel.on("change", (data: any) => saveState("letters", { ...data }));

const gameView = new GameView();
const finalResultsView = new FinalResultsView();
const gameController = new GameController(
  gameModel,
  gameView,
  finalResultsView
);

if (module.hot) {
    module.hot.accept();
}
