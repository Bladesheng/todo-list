import { arrayMove } from "./functions";

export default class list {
  constructor(name) {
    this.name = name;

    this.cards = [];
  }


  addCard(card) {
    this.cards.push(card);
  }

  removeCard(cardPosition) {
    this.cards.splice(cardPosition, 1);
  }

  changeName(newName) {
    this.name = newName;
  }

  moveCard(oldPosition, newPosition) {
    arrayMove(this.cards, oldPosition, newPosition);
  }
}