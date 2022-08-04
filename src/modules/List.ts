import { arrayMove } from "./functions";

export default class List {
  name: string;
  cards: object[];

  constructor(name: string) {
    this.name = name;

    this.cards = [];
  }

  changeName(newName: string) {
    this.name = newName;
  }

  addCard(card: object) {
    this.cards.push(card);
  }

  removeCard(cardPosition: number) {
    this.cards.splice(cardPosition, 1);
  }

  moveCard(oldPosition: number, newPosition: number) {
    arrayMove(this.cards, oldPosition, newPosition);
  }
}
