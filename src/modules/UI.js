import board from "./board";
import list from "./list";
import card from "./card";
import storage from "./storage";

export default class UI {
  static currentBoard;

  static init() {
    const newBoardBtn = document.querySelector("button");
    newBoardBtn.addEventListener("click", () => {
      storage.createBoard(prompt("Enter new board name:"));

      console.log(storage.boards);
    })

    
  }

  static changeBoard(newBoardPosition) {
    UI.currentBoard = newBoardPosition;
  }



}