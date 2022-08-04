export default class Card {
  constructor(title, description, priority) {
    this.title = title;
    this.description = description;
    this.priority = priority;
  }

  changeTitle(newTitle) {
    this.title = newTitle;
  }

  changeDescription(newDescription) {
    this.description = newDescription;
  }

  changePriority(newPriority) {
    this.priority = newPriority;
  }
}
