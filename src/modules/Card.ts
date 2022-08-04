export default class Card {
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
