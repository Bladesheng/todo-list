import { arrayMove } from "./functions";
import { ICard } from "./Card";

export interface IList {
  name: string;
  cards: ICard[];

  changeName(newName: string): void;
  addCard(card: ICard): void;
  removeCard(cardPosition: number): void;
  moveCard(oldPosition: number, newPosition: number): void;
}

export class List implements IList {
  name: string;
  cards: ICard[];

  constructor(name: string) {
    this.name = name;

    this.cards = [];
  }

  changeName(newName: string) {
    this.name = newName;
  }

  addCard(card: ICard) {
    this.cards.push(card);
  }

  removeCard(cardPosition: number) {
    this.cards.splice(cardPosition, 1);
  }

  moveCard(oldPosition: number, newPosition: number) {
    arrayMove(this.cards, oldPosition, newPosition);
  }
}
