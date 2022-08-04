import Storage from "./Storage";
import DOM from "./DOM";

export default class UI {
  static currentBoardIndex: number;

  static init() {
    if (
      localStorage.getItem("boards") !== null &&
      localStorage.getItem("boards") !== "[]"
    ) {
      // reconstruct board links (in sidebar) from local storage
      Storage.boards.forEach((board: object, boardIndex: number) => {
        DOM.createBoardBtn(boardIndex);
      });

      DOM.constructBoard(UI.currentBoardIndex);
    }

    const newBoardBtn = document.querySelector("button.newBoard");
    const newBoardInput: HTMLInputElement =
      document.querySelector("input.newBoard");

    DOM.attachInputListener(newBoardBtn, newBoardInput, () => {
      const userInput = newBoardInput.value;
      const boardIndex = Storage.createBoard(userInput);
      DOM.createBoardBtn(boardIndex);

      UI.currentBoardIndex = boardIndex;
      Storage.setLocalStorage(); // to save the new current board index
      console.log(Storage.boards);
    });
  }
}
