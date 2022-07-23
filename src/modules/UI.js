import Storage from "./Storage";
import DOM from "./DOM";

export default class UI {
  static currentBoardIndex;

  static init() {
    // reconstruct board links from local storage (if it's not empty)
    if (localStorage.getItem("boards") !== null) {
      Storage.boards.forEach((board, boardIndex) => {
        DOM.createBoardBtn(boardIndex);
      })
      // reconstruct last selected board
      DOM.createBoard(UI.currentBoardIndex);
      //reconstruct lists
      //reconstruct buttons
    }


    const newBoardBtn = document.querySelector("button");
    newBoardBtn.addEventListener("click", () => {
      const userInput = prompt("Enter new board name:");

      const boardIndex = Storage.createBoard(userInput);
      DOM.createBoardBtn(userInput, boardIndex);
  
      UI.currentBoardIndex = boardIndex;
      Storage.setLocalStorage(); // to save the new current board index

      console.log(Storage.boards);
    })   
  }

  static changeBoard(newBoardPosition) {
    UI.currentBoardIndex = newBoardPosition;
  }
}