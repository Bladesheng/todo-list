import Storage from "./Storage";

export default class UI {
  static currentBoard;

  static init() {
    const newBoardBtn = document.querySelector("button");
    newBoardBtn.addEventListener("click", () => {
      Storage.createBoard(prompt("Enter new board name:"));

      console.log(Storage.boards);
    })

    
  }

  static changeBoard(newBoardPosition) {
    UI.currentBoard = newBoardPosition;
  }



}