import { arrayMove } from "./functions";
import { IList } from "./List";

export interface IBoard {
  name: string;
  lists: IList[];

  changeName(newName: string): void;
  addList(list: IList): void;
  removeList(listPosition: number): void;
  moveList(oldPosition: number, newPosition: number): void;
}

export class Board implements IBoard {
  name: string;
  lists: IList[];

  constructor(name: string) {
    this.name = name;

    this.lists = [];
  }

  changeName(newName: string) {
    this.name = newName;
  }

  addList(list: IList) {
    this.lists.push(list);
  }

  removeList(listPosition: number) {
    this.lists.splice(listPosition, 1);
  }

  moveList(oldPosition: number, newPosition: number) {
    arrayMove(this.lists, oldPosition, newPosition);
  }
}
