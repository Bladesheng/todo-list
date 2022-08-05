export interface ICard {
  title: string;
  description: string;
  priority: number;

  changeTitle(newTitle: string): void;
  changeDescription(newDescription: string): void;
  changePriority(newPriority: number): void;
}

export class Card implements ICard {
  title: string;
  description: string;
  priority: number;

  constructor(title: string, description: string, priority: number) {
    this.title = title;
    this.description = description;
    this.priority = priority;
  }

  changeTitle(newTitle: string) {
    this.title = newTitle;
  }

  changeDescription(newDescription: string) {
    this.description = newDescription;
  }

  changePriority(newPriority: number) {
    this.priority = newPriority;
  }
}
