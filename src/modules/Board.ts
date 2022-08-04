import { arrayMove } from "./functions";

export default class Board {
  name: string;
  lists: object[];

  constructor(name: string) {
    this.name = name;

    this.lists = [];
  }

  changeName(newName: string) {
    this.name = newName;
  }

  addList(list: object) {
    this.lists.push(list);
  }

  removeList(listPosition: number) {
    this.lists.splice(listPosition, 1);
  }

  moveList(oldPosition: number, newPosition: number) {
    arrayMove(this.lists, oldPosition, newPosition);
  }
}
