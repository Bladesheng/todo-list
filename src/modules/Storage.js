import Board from "./Board";
import List from "./List";
import Card from "./Card";

export default class Storage { 
  static boards = [];
  static {
    console.log("storage initialized");
  }


  // boards manipulation
  static createBoard(name) {
    const newBoard = new Board(name);
    Storage.boards.push(newBoard);
  }

  static changeBoardName(newName, boardIndex) {
    const board = Storage.boards[boardIndex];
    board.changeName(newName);
  }

  static deleteBoard(boardIndex) {
    Storage.boards.splice(boardIndex, 1);
  }


  // lists manipulation
  static createList(name, boardIndex) {
    const list = new List(name);
    Storage.boards[boardIndex].addList(list);
  }

  static changeListName(newName, listIndex, boardIndex) {
    const list = Storage.boards[boardIndex].lists[listIndex];
    list.changeName(newName);
  }
  
  static moveList(oldPosition, newPosition, boardIndex) {
    Storage.boards[boardIndex].moveList(oldPosition, newPosition);
  }
  
  static removeList(listIndex, boardIndex) {
    Storage.boards[boardIndex].removeList(listIndex);
  }


  // cards manipulation 

  static createCard(name, description, priority, listIndex, boardIndex) {
    const list = Storage.boards[boardIndex[listIndex]];

  }




}