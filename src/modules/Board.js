import { arrayMove } from "./functions";

export default class Board {
  constructor(name) {
    this.name = name;

    this.lists = [];
  }


  changeName(newName) {
    this.name = newName;
  }
  
  
  addList(list) {
    this.lists.push(list);
  }

  removeList(listPosition) {
    this.lists.splice(listPosition, 1);
  }

  moveList(oldPosition, newPosition) {
    arrayMove(this.lists, oldPosition, newPosition);
  }
}