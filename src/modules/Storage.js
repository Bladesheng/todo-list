import Board from "./Board";
import List from "./List";
import Card from "./Card";

export default class Storage { 
  static boards;
  static {
    Storage.getLocalStorage();
    console.log("storage initialized");
  }


  // local storage
  static getLocalStorage() {
    if (localStorage.getItem("boards") === null) {
      Storage.boards = [];
    }
    else {
      Storage.boards = JSON.parse(localStorage.getItem("boards"));
    }
  }

  static setLocalStorage() {
    localStorage.setItem("boards", JSON.stringify(Storage.boards))
  }


  // boards manipulation
  static createBoard(name) {
    const newBoard = new Board(name);
    Storage.boards.push(newBoard);
    Storage.setLocalStorage();
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
  
  static changeCardDescription(newDescription, cardIndex, listIndex, boardIndex) {
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