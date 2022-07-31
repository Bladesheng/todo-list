import Storage from "./Storage";
import DOM from "./DOM";

export default class UI {
  static currentBoardIndex;

  static init() {
    if (localStorage.getItem("boards") !== null && localStorage.getItem("boards") !== "[]") {
      // reconstruct board links (in sidebar) from local storage
      Storage.boards.forEach((board, boardIndex) => {
        DOM.createBoardBtn(boardIndex);
      })

      DOM.constructBoard(UI.currentBoardIndex);
    }

    
    const newBoardBtn = document.querySelector("button.newBoard");
    const newBoardInput = document.querySelector("input.newBoard");
    DOM.attachInputListener(newBoardBtn, newBoardInput, () => {
      const userInput = newBoardInput.value;
      const boardIndex = Storage.createBoard(userInput);
      DOM.createBoardBtn(boardIndex);
      
      UI.currentBoardIndex = boardIndex;
      Storage.setLocalStorage(); // to save the new current board index
      console.log(Storage.boards);
    });

    // modal dynamic input for title
    // const modalWrapper = document.querySelector(".modalWrapper");
    // const cardTitleText = modalWrapper.querySelector("h2.title");
    // const cardTitleInput = modalWrapper.querySelector("input.title");
    // DOM.attachInputListener(cardTitleText, cardTitleInput, () => {
    //   const newTitle = cardTitleInput.value;

    //   const list = DOM.lastCard.parentNode;
    //   const cardIndex = DOM.lastCard.dataset.index;
    //   const listIndex = list.dataset.index;
    //   const boardIndex = list.parentNode.dataset.index;

    //   const title = DOM.lastCard.querySelector("h3");

    //   // change card title in modal
    //   cardTitleText.textContent = newTitle;

    //   // change card title in list
    //   title.textContent = newTitle;

    //   // update storage
    //   Storage.changeCardTitle(newTitle, cardIndex, listIndex, boardIndex);
    // }, false)
  }
}