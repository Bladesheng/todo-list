import board from "./board";
import list from "./list";
import card from "./card";

export default class storage { 
  static boards = [];
  static {
    console.log("storage initialized");
  }


  // boards manipulation
  static createBoard(name) {
    const newBoard = new board(name);
    storage.boards.push(newBoard);
  }

  static changeBoardName(newName, boardIndex) {
    const board = storage.boards[boardIndex];
    board.changeName(newName);
  }

  static deleteBoard(boardIndex) {
    storage.boards.splice(boardIndex, 1);
  }


  // lists manipulation
  static createList(name, boardIndex) {
    const list = new list(name);
    storage.boards[boardIndex].addList(list);
  }

  static changeListName(newName, listIndex, boardIndex) {
    const list = storage.boards[boardIndex].lists[listIndex];
    list.changeName(newName);
  }
  
  static moveList(oldPosition, newPosition, boardIndex) {
    storage.boards[boardIndex].moveList(oldPosition, newPosition);
  }
  
  static removeList(listIndex, boardIndex) {
    storage.boards[boardIndex].removeList(listIndex);
  }


  // cards manipulation 

  static createCard(name, description, priority, listIndex, boardIndex) {
    const list = storage.boards[boardIndex[listIndex]];

  }




}