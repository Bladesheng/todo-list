import { arrayMove } from "./functions";

export default class board {
  constructor(name) {
    this.name = name;

    this.lists = [];
  }


  addList(list) {
    this.lists.push(list);
  }

  removeList(listPosition) {
    this.lists.splice(listPosition, 1);
  }

  changeName(newName) {
    this.name = newName;
  }

  moveList(oldPosition, newPosition) {
    arrayMove(this.lists, oldPosition, newPosition);
  }
}