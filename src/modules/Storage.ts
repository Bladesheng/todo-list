import Board from "./Board";
import List from "./List";
import Card from "./Card";
import UI from "./UI";

export default class Storage {
  static boards;

  static {
    Storage.getLocalStorage();
  }

  // local storage
  static getLocalStorage() {
    Storage.boards = [];
    if (localStorage.getItem("boards") !== null) {
      // if boards local storage isn't empty
      // the json can't store functions, so all the objects need to be remade

      // recreate board objects
      const jsonBoards = JSON.parse(localStorage.getItem("boards"));
      jsonBoards.forEach((jsonBoard) => {
        const board = new Board(jsonBoard.name);

        // recreate list objects
        const jsonLists = jsonBoard.lists;
        jsonLists.forEach((jsonList) => {
          const list = new List(jsonList.name);
          board.addList(list);

          // recreate card objects
          const jsonCards = jsonList.cards;
          jsonCards.forEach((jsonCard) => {
            const card = new Card(
              jsonCard.title,
              jsonCard.description,
              jsonCard.priority
            );
            list.addCard(card);
          });
        });

        // push the newly created board object straight into storage
        Storage.boards.push(board);
      });

      UI.currentBoardIndex = localStorage.getItem("lastBoard");
      console.log(Storage.boards);
    }
  }

  static setLocalStorage() {
    localStorage.setItem("boards", JSON.stringify(Storage.boards));
    localStorage.setItem("lastBoard", UI.currentBoardIndex);
  }

  // boards manipulation
  static createBoard(name) {
    const newBoard = new Board(name);
    Storage.boards.push(newBoard);
    Storage.setLocalStorage();
    return Storage.boards.length - 1; // return index of the new board
  }

  static changeBoardName(newName, boardIndex) {
    const board = Storage.boards[boardIndex];
    board.changeName(newName);
    Storage.setLocalStorage();
  }

  static deleteBoard(boardIndex) {
    Storage.boards.splice(boardIndex, 1);
    Storage.setLocalStorage();
  }

  // lists manipulation
  static createList(name, boardIndex) {
    const board = Storage.boards[boardIndex];
    const list = new List(name);
    board.addList(list);
    Storage.setLocalStorage();
  }

  static changeListName(newName, listIndex, boardIndex) {
    const list = Storage.boards[boardIndex].lists[listIndex];
    list.changeName(newName);
    Storage.setLocalStorage();
  }

  static moveList(oldPosition, newPosition, boardIndex) {
    Storage.boards[boardIndex].moveList(oldPosition, newPosition);
    Storage.setLocalStorage();
  }

  static removeList(listIndex, boardIndex) {
    Storage.boards[boardIndex].removeList(listIndex);
    Storage.setLocalStorage();
  }

  // cards manipulation
  static createCard(name, description, priority, listIndex, boardIndex) {
    const list = Storage.boards[boardIndex].lists[listIndex];
    const card = new Card(name, description, priority);
    list.addCard(card);
    Storage.setLocalStorage();
  }

  static removeCard(cardPosition, listIndex, boardIndex) {
    const list = Storage.boards[boardIndex].lists[listIndex];
    list.removeCard(cardPosition);
    Storage.setLocalStorage();
  }

  static moveCard(oldPosition, newPosition, listIndex, boardIndex) {
    const list = Storage.boards[boardIndex].lists[listIndex];
    list.moveCard(oldPosition, newPosition);
    Storage.setLocalStorage();
  }

  static changeCardTitle(newTitle, cardIndex, listIndex, boardIndex) {
    const card = Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];
    card.changeTitle(newTitle);
    Storage.setLocalStorage();
  }

  static changeCardDescription(
    newDescription,
    cardIndex,
    listIndex,
    boardIndex
  ) {
    const card = Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];
    card.changeDescription(newDescription);
    Storage.setLocalStorage();
  }

  static changeCardPriority(newPriority, cardIndex, listIndex, boardIndex) {
    const card = Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];
    card.changePriority(newPriority);
    Storage.setLocalStorage();
  }
}
