import UI from "./UI";
import Storage from "./Storage";

export default class DOM {
  static currentBoard;
  static sidebar;

  static {
    DOM.currentBoard = document.querySelector(".currentBoard");
    DOM.sidebar = document.querySelector(".sidebar");
  }
  

  static createBoardBtn(boardIndex) {
    const boardBtn = document.createElement("button");
    const name = Storage.boards[boardIndex].name;
    boardBtn.textContent = name;
    boardBtn.dataset.index = boardIndex;
    DOM.sidebar.appendChild(boardBtn);

    boardBtn.addEventListener("click", (e) => {
      // update and save new board index
      UI.currentBoardIndex = e.target.dataset.index;
      Storage.setLocalStorage(); 

      DOM.createBoard(e.target.dataset.index);
    })
  }

  static createBoard(boardIndex) {
    DOM.removeBoard()
    const board = document.createElement("div");
    board.classList.add("board");
    board.dataset.index = boardIndex;
    DOM.currentBoard.appendChild(board);

    const heading = document.createElement("h1");
    const name = Storage.boards[boardIndex].name;
    heading.textContent = name;
    board.appendChild(heading);
  }

  static removeBoard() {
    DOM.currentBoard.textContent = "";
  }
}