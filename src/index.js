import "./style.scss";
import Board from "./modules/Board";
import List from "./modules/List";
import Card from "./modules/Card";
import Storage from "./modules/Storage";
import UI from "./modules/UI";


UI.init();


// debug
console.log(Storage.boards);
Storage.createBoard("some board");
Storage.createList("some list", 0);
Storage.createCard("feed cat", "some food", 69, 0, 0);
Storage.createCard("feed cat", "some food", 65, 0, 0);
Storage.changeCardTitle("dont feed cat", 0, 0, 0);