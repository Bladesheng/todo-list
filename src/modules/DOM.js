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
      const boardIndex = e.target.dataset.index;
      // update and save new current board index
      UI.currentBoardIndex = boardIndex;
      Storage.setLocalStorage(); 

      DOM.constructBoard(boardIndex);
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

  static createList(boardIndex, listIndex) {
    const board = document.querySelector(".board");

    const list = document.createElement("div");
    list.classList.add("list");
    list.dataset.index = listIndex;
    board.appendChild(list);

    const heading = document.createElement("h2");
    const name = Storage.boards[boardIndex].lists[listIndex].name;
    heading.textContent = name;
    list.appendChild(heading);
  }

  static createCard(boardIndex, listIndex, cardIndex) {
    const list = document.querySelector(`.list[data-index="${listIndex}"]`);

    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = cardIndex;
    list.appendChild(card);

    const cardObject = Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];

    const title = document.createElement("h3");
    title.textContent = cardObject.title;
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = cardObject.description;
    card.appendChild(description);

    const priority = document.createElement("p");
    priority.textContent = cardObject.priority;
    card.appendChild(priority);
  }

  // constructs the whole board, including all lists and cards
  static constructBoard(boardIndex) {
    // reconstruct last selected board
    DOM.createBoard(boardIndex);

    //reconstruct lists
    const currentBoard = Storage.boards[boardIndex];
    currentBoard.lists.forEach((list, listIndex) => {
      DOM.createList(boardIndex, listIndex);

      //reconstruct cards
      list.cards.forEach((card, cardIndex) => {
        DOM.createCard(boardIndex, listIndex, cardIndex);
      })
    }) 
  }
}