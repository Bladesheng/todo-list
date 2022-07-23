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

      // reconstruct last selected board
      DOM.createBoard(UI.currentBoardIndex);

      //reconstruct lists
      const currentBoard = Storage.boards[UI.currentBoardIndex];
      currentBoard.lists.forEach((list, listIndex) => {
        DOM.createList(UI.currentBoardIndex, listIndex);

        //reconstruct buttons
        list.cards.forEach((card, cardIndex) => {
          DOM.createCard(UI.currentBoardIndex, listIndex, cardIndex);
        })
      }) 
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