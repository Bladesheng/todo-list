import UI from "./UI";
import Storage from "./Storage";

export default class DOM {
  static currentBoard;
  static sidebar;

  static {
    DOM.currentBoard = document.querySelector(".currentBoard");
    DOM.sidebar = document.querySelector(".sidebar");
  }


  static updateIndexes(parentNode) {
    // everytime you delete/move element in DOM, the indexes
    // need to be updated to match the storage
    // to prevent indexes going: "0, 1, 3, 4, 5"
    const elements = parentNode.querySelectorAll("[data-index]")
    elements.forEach((element, newIndex) => {
      element.dataset.index = newIndex;
    })
  }


  static attachInputListener(textElement, inputElement, processCallback) {
    // Event listener that dynamically swaps visibility of
    // text element to input element when you click on text element.
    // When you lose focus or press enter, it executes the callback
    // funtion and swaps back to text element.
    textElement.addEventListener("click", () => {
      function sendInput() {
        if (inputElement.value !== "") {
          textElement.classList.remove("active");
          inputElement.classList.remove("active");
          
          processCallback();
          inputElement.value = "";
        }
        else {
          textElement.classList.remove("active");
          inputElement.classList.remove("active");
        }
      }
      
      // hides the text, shows the input and focuses it
      textElement.classList.add("active");
      inputElement.classList.add("active");
      inputElement.focus();

      // when you lose focus by clicking somewhere outside the input
      inputElement.onblur = () => {
        sendInput();
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          sendInput();
        }
        if (e.key === "Escape") {
          inputElement.value = "";
          sendInput();
        }
      })
    })
  }
  

  // boards manipulation
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
    DOM.wipeBoard()

    const heading = document.createElement("h1");
    const boardName = Storage.boards[boardIndex].name;
    heading.textContent = boardName;
    DOM.currentBoard.appendChild(heading);

    const renameBtn = document.createElement("button");
    renameBtn.classList.add("rename");
    renameBtn.textContent = "Rename board";
    renameBtn.addEventListener("click", () => {
      const newName = prompt("Enter new board name");
      const heading = DOM.currentBoard.querySelector("h1");
      heading.textContent = newName;

      const boardIndex = UI.currentBoardIndex;
      const boardLink = document.querySelector(`.sidebar>button[data-index="${boardIndex}"]`);
      boardLink.textContent = newName;

      Storage.changeBoardName(newName, boardIndex);
    })
    DOM.currentBoard.appendChild(renameBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "Delete board";
    deleteBtn.addEventListener("click", () => {
      DOM.wipeBoard();

      const boardIndex = UI.currentBoardIndex;
      const boardLink = document.querySelector(`.sidebar>button[data-index="${boardIndex}"]`);
      boardLink.remove();

      // to prevent staying at undefined index when
      // when last item is deleted
      UI.currentBoardIndex = Storage.boards.length - 2;
      if (UI.currentBoardIndex < 0) {
        UI.currentBoardIndex = undefined;
      }

      DOM.updateIndexes(DOM.sidebar);

      Storage.deleteBoard(boardIndex);
    })
    DOM.currentBoard.appendChild(deleteBtn);


    const board = document.createElement("div");
    board.classList.add("board");
    board.dataset.index = boardIndex;
    DOM.currentBoard.appendChild(board);

    const newListBtn = document.createElement("button");
    const newListInput = document.createElement("input");
    newListBtn.classList.add("newList", "dynamicText");
    newListBtn.textContent = "Add another list";
    board.appendChild(newListBtn);
    
    newListInput.setAttribute("type", "text");
    newListInput.classList.add("newList", "dynamicInput");
    board.appendChild(newListInput);

    DOM.attachInputListener(newListBtn, newListInput, () => {
      const listName = newListInput.value;
      Storage.createList(listName, UI.currentBoardIndex);

      const newListIndex = Storage.boards[UI.currentBoardIndex].lists.length - 1;
      DOM.createList(UI.currentBoardIndex, newListIndex);
    })
  }

  static wipeBoard() {
    DOM.currentBoard.textContent = "";
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


  // lists manipulation
  static createList(boardIndex, listIndex) {
    const board = document.querySelector(".board");

    const list = document.createElement("div");
    list.classList.add("list");
    list.dataset.index = listIndex;
    board.appendChild(list);

    const heading = document.createElement("h2");
    const name = Storage.boards[boardIndex].lists[listIndex].name;
    heading.textContent = name;
    heading.addEventListener("click", () => {
      const newName = prompt("Enter new list name");
      heading.textContent = newName;

      Storage.changeListName(newName, list.dataset.index, UI.currentBoardIndex);
    })
    list.appendChild(heading);

    const newCardBtn = document.createElement("button");
    newCardBtn.classList.add("newCard");
    newCardBtn.textContent = "Add a card";
    newCardBtn.addEventListener("click", () => {
      const cardName = prompt("Enter new card name");
      const cardDescription = prompt("Enter card description");
      const cardPriority = prompt("Enter card priority");

      const listIndex = list.dataset.index;
      Storage.createCard(cardName, cardDescription, cardPriority, listIndex, UI.currentBoardIndex);

      const newCardIndex = Storage.boards[UI.currentBoardIndex].lists[listIndex].cards.length - 1;
      DOM.createCard(UI.currentBoardIndex, listIndex, newCardIndex);
    })
    list.appendChild(newCardBtn);

    const removeListBtn = document.createElement("button");
    removeListBtn.classList.add("removeCard");
    removeListBtn.textContent = "X";
    removeListBtn.addEventListener("click", () => {
      list.remove();
      
      Storage.removeList(list.dataset.index, UI.currentBoardIndex);
      
      DOM.updateIndexes(board);
    })
    list.appendChild(removeListBtn);
  }


  // cards manipulation 
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
}