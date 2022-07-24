import Storage from "./Storage";
import DOM from "./DOM";

export default class UI {
  static currentBoardIndex;

  static init() {
    if (localStorage.getItem("boards") !== null) {
      // reconstruct board links (in sidebar) from local storage
      Storage.boards.forEach((board, boardIndex) => {
        DOM.createBoardBtn(boardIndex);
      })

      DOM.constructBoard(UI.currentBoardIndex);
    }


    const newBoardBtn = document.querySelector("button");
    newBoardBtn.addEventListener("click", () => {
      const userInput = prompt("Enter new board name:");

      const boardIndex = Storage.createBoard(userInput);
      DOM.createBoardBtn(boardIndex);
  
      UI.currentBoardIndex = boardIndex;
      Storage.setLocalStorage(); // to save the new current board index

      console.log(Storage.boards);
    })   
  }

  static changeBoard(newBoardPosition) {
    UI.currentBoardIndex = newBoardPosition;
  }
}