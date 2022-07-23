import "./style.scss";
import board from "./modules/board";
import list from "./modules/list";
import card from "./modules/card";
import storage from "./modules/storage";
import UI from "./modules/UI";


UI.init();

storage.createBoard("some board");
console.log(storage.boards);
storage.createList("some list", 0);