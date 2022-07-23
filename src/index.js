import "./style.scss";
import Board from "./modules/Board";
import List from "./modules/List";
import Card from "./modules/Card";
import Storage from "./modules/Storage";
import UI from "./modules/UI";


UI.init();

Storage.createBoard("some board");
console.log(Storage.boards);
Storage.createList("some list", 0);