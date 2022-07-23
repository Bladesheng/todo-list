import { arrayMove } from "./functions";

export default class List {
  constructor(name) {
    this.name = name;

    this.cards = [];
  }

  
  changeName(newName) {
    this.name = newName;
  }


  addCard(card) {
    this.cards.push(card);
  }

  removeCard(cardPosition) {
    this.cards.splice(cardPosition, 1);
  }

  moveCard(oldPosition, newPosition) {
    arrayMove(this.cards, oldPosition, newPosition);
  }
}