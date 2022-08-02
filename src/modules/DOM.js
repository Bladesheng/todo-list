import UI from "./UI";
import Storage from "./Storage";

export default class DOM {
  static currentBoard;

  static sidebar;

  static svgArrowsPaths;

  static lastCard;

  static {
    DOM.currentBoard = document.querySelector(".currentBoard");
    DOM.sidebar = document.querySelector(".sidebar");
    DOM.svgArrowsPaths = [
      // up, right, down, left
      "M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z",
      "M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z",
      "M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z",
      "M20,9V15H12V19.84L4.16,12L12,4.16V9H20Z"
    ];

    // horizontal mouse scrolling
    window.addEventListener("wheel", (e) => {
      const container = document.querySelector("main");
      if (e.deltaY > 0) container.scrollLeft += 100;
      else container.scrollLeft -= 100;
    });

    // close modal when you click outside of modal or the "X" button
    const modalWrapper = document.querySelector(".modalWrapper");
    modalWrapper.addEventListener("click", (e) => {
      if (e.target === modalWrapper) {
        modalWrapper.style.display = "none";
      }
    });

    // modal - close modal button
    const closeBtn = modalWrapper.querySelector(".close");
    closeBtn.addEventListener("click", () => {
      modalWrapper.style.display = "none";
    });

    // modal - delete card button
    DOM.modalDeleteListener();

    // modal - dynamic input for title
    DOM.modalTitleListener();

    // textarea automatic resizing
    const modalTextarea = document.querySelector("textarea.description");
    modalTextarea.addEventListener("focus", () => {
      function resize() {
        modalTextarea.style.height = "";
        modalTextarea.style.height = `${modalTextarea.scrollHeight + 6} + "px"`;
      }

      // initial resize on focus
      resize();

      // resize automatically when typing
      modalTextarea.oninput = () => {
        resize();
      };
    });

    // show sidebar
    const hamburgerBtn = document.querySelector("button.burger");
    const sidebar = document.querySelector(".sidebar");

    hamburgerBtn.addEventListener("click", () => {
      sidebar.classList.remove("hidden");
    });

    // hide sidebar
    DOM.currentBoard.addEventListener("click", () => {
      sidebar.classList.add("hidden");
    });
  }

  // for deleting current card from modal
  static modalDeleteListener() {
    const deleteBtn = document.querySelector(".modal>.delete"); //
    deleteBtn.addEventListener("click", () => {
      const list = DOM.lastCard.parentNode;
      const cardIndex = DOM.lastCard.dataset.index;
      const listIndex = list.dataset.index;
      const boardIndex = list.parentNode.dataset.index;

      const modalWrapper = document.querySelector(".modalWrapper");
      modalWrapper.style.display = "none";

      // delete card from list in DOM
      list.removeChild(DOM.lastCard);

      // update storage
      Storage.removeCard(cardIndex, listIndex, boardIndex);
    });
  }

  static modalTitleListener() {
    const cardTitleText = document.querySelector("h2.title");
    const cardTitleInput = document.querySelector("input.title");

    DOM.attachInputListener(
      cardTitleText,
      cardTitleInput,
      () => {
        const newTitle = cardTitleInput.value;

        const list = DOM.lastCard.parentNode;
        const cardIndex = DOM.lastCard.dataset.index;
        const listIndex = list.dataset.index;
        const boardIndex = list.parentNode.dataset.index;

        const title = DOM.lastCard.querySelector("h3");

        // change card title in modal
        cardTitleText.textContent = newTitle;

        // change card title in list
        title.textContent = newTitle;

        // update storage
        Storage.changeCardTitle(newTitle, cardIndex, listIndex, boardIndex);
      },
      false
    );
  }

  static updateIndexes(parentNode) {
    // everytime you delete/move element in DOM, the indexes
    // need to be updated to match the storage
    // to prevent indexes going: "0, 1, 3, 4, 5"
    const elements = parentNode.querySelectorAll(":scope > [data-index]");
    elements.forEach((element, newIndex) => {
      element.dataset.index = newIndex;
    });
  }

  static attachInputListener(
    textElement,
    inputElement,
    processCallback,
    wipeInput = true
  ) {
    // Event listener that dynamically swaps visibility of
    // text element to input element when you click on text element.
    // When you lose focus or press enter, it executes the callback
    // function and swaps back to text element.
    textElement.addEventListener("click", () => {
      function sendInput() {
        if (inputElement.value !== "") {
          textElement.classList.remove("active");
          inputElement.classList.remove("active");

          processCallback();
          if (wipeInput) {
            // wipe out the input by default, so you always start fresh
            inputElement.value = "";
          }
        } else {
          textElement.classList.remove("active");
          inputElement.classList.remove("active");
        }
      }

      // hides the text, shows the input and focuses it
      textElement.classList.add("active");
      inputElement.classList.add("active");
      inputElement.focus();

      // when you lose focus by clicking somewhere outside the input
      inputElement.onblur = () => {
        sendInput();
      };

      inputElement.onkeydown = (e) => {
        if (e.key === "Enter") {
          sendInput();
        }
        if (e.key === "Escape") {
          inputElement.value = "";
          sendInput();
          if (!wipeInput) {
            // reset the input to whatever was the previous text
            inputElement.value = textElement.textContent;
          }
        }
      };
    });
  }

  static moveListListener(directionBtn) {
    directionBtn.addEventListener("click", () => {
      const list = directionBtn.parentNode;
      const listIndex = parseInt(list.dataset.index, 10);
      const lists = document.querySelectorAll(".list");
      const direction = directionBtn.classList[0];

      // also makes sure you don't exceed array range
      if (direction === "moveBackBtn" && listIndex > 0) {
        Storage.moveList(listIndex, listIndex - 1, UI.currentBoardIndex);
        list.parentNode.insertBefore(list, lists[listIndex - 1]);
      } else if (direction === "moveForwardBtn" && listIndex < lists.length) {
        Storage.moveList(listIndex, listIndex + 1, UI.currentBoardIndex);
        list.parentNode.insertBefore(list, lists[listIndex + 2]);
      }

      DOM.updateIndexes(list.parentNode);
    });
  }

  static moveCardListener(directionBtn) {
    directionBtn.addEventListener("click", () => {
      const card = directionBtn.parentNode;
      const cardIndex = parseInt(card.dataset.index, 10);
      const cards = card.parentNode.querySelectorAll(".card");
      const listIndex = parseInt(card.parentNode.dataset.index, 10);
      const direction = directionBtn.classList[0];

      // also makes sure you don't exceed array range
      if (direction === "moveUpBtn" && cardIndex > 0) {
        Storage.moveCard(
          cardIndex,
          cardIndex - 1,
          listIndex,
          UI.currentBoardIndex
        );
        card.parentNode.insertBefore(card, cards[cardIndex - 1]);
      } else if (direction === "moveDownBtn" && cardIndex < cards.length) {
        Storage.moveCard(
          cardIndex,
          cardIndex + 1,
          listIndex,
          UI.currentBoardIndex
        );
        card.parentNode.insertBefore(card, cards[cardIndex + 2]);
      }

      DOM.updateIndexes(card.parentNode);
    });
  }

  static createSVG(customPath) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const SVGElement = document.createElementNS(SVG_NS, "svg");
    SVGElement.setAttribute("viewBox", "0 0 24 24");

    const SVGPathElement = document.createElementNS(SVG_NS, "path");
    SVGPathElement.setAttribute("fill", "currentColor");
    SVGPathElement.setAttribute("d", customPath);
    SVGElement.appendChild(SVGPathElement);

    return SVGElement;
  }

  static createKebabMenu(kebabBtn) {
    const kebabMenu = document.createElement("div");
    kebabMenu.classList.add("menu");

    // trash icon "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete this list";
    removeBtn.classList.add("removeList");
    kebabMenu.appendChild(removeBtn);
    kebabBtn.parentNode.appendChild(kebabMenu);

    // delete list button
    removeBtn.onmousedown = (event) => {
      // blur event would result in this listener being removed before
      // execution, so we prevent the blur and execute this listener's callback
      event.preventDefault();

      // remove the list from DOM and from Storage
      kebabBtn.parentNode.remove();
      Storage.removeList(
        kebabBtn.parentNode.dataset.index,
        UI.currentBoardIndex
      );

      const board = document.querySelector(".board");
      DOM.updateIndexes(board);
    };

    function closeMenu() {
      // remove the menu from DOM
      kebabMenu.remove();

      // add the original listener to kebab button again
      kebabBtn.onclick = () => {
        DOM.createKebabMenu(kebabBtn);
      };
    }
    // close menu when you lose focus or click the kebab button again
    kebabBtn.onblur = () => {
      closeMenu();
    };

    kebabBtn.onclick = () => {
      closeMenu();
    };
  }

  // boards manipulation
  static createBoardBtn(boardIndex) {
    const boardBtn = document.createElement("button");
    const name = Storage.boards[boardIndex].name;
    boardBtn.textContent = name;
    boardBtn.dataset.index = boardIndex;
    DOM.sidebar.appendChild(boardBtn);

    boardBtn.addEventListener("click", (e) => {
      const clickedBoardIndex = e.target.dataset.index;
      // update and save new current board index
      UI.currentBoardIndex = clickedBoardIndex;
      Storage.setLocalStorage();

      DOM.constructBoard(clickedBoardIndex);
    });
  }

  static createBoard(boardIndex) {
    DOM.wipeBoard();

    const boardName = Storage.boards[boardIndex].name;

    const heading = document.createElement("h1");
    const renameInput = document.createElement("input");
    heading.classList.add("dynamicText");
    heading.textContent = boardName;
    DOM.currentBoard.appendChild(heading);

    renameInput.setAttribute("type", "text");
    renameInput.classList.add("rename", "dynamicInput");
    renameInput.value = boardName;
    DOM.currentBoard.appendChild(renameInput);

    DOM.attachInputListener(
      heading,
      renameInput,
      () => {
        const newName = renameInput.value;
        const clickedHeading = DOM.currentBoard.querySelector("h1");
        clickedHeading.textContent = newName;

        const clickedBoardIndex = UI.currentBoardIndex;
        const boardLink = document.querySelector(
          `.sidebar>button[data-index="${clickedBoardIndex}"]`
        );
        boardLink.textContent = newName;

        Storage.changeBoardName(newName, clickedBoardIndex);
      },
      false
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "Delete board";
    deleteBtn.addEventListener("click", () => {
      DOM.wipeBoard();

      const clickedBoardIndex = UI.currentBoardIndex;
      const boardLink = document.querySelector(
        `.sidebar>button[data-index="${clickedBoardIndex}"]`
      );
      boardLink.remove();

      // to prevent staying at undefined index when
      // when last item is deleted
      UI.currentBoardIndex = Storage.boards.length - 2;
      if (UI.currentBoardIndex < 0) {
        UI.currentBoardIndex = undefined;
      }

      DOM.updateIndexes(DOM.sidebar);

      Storage.deleteBoard(clickedBoardIndex);
    });
    DOM.currentBoard.appendChild(deleteBtn);

    const board = document.createElement("div");
    board.classList.add("board");
    board.dataset.index = boardIndex;
    DOM.currentBoard.appendChild(board);

    const newListBtn = document.createElement("button");
    const newListInput = document.createElement("input");
    newListBtn.classList.add("newList", "dynamicText");
    newListBtn.textContent = "+ Add another list";
    board.appendChild(newListBtn);

    newListInput.setAttribute("type", "text");
    newListInput.classList.add("newList", "dynamicInput");
    board.appendChild(newListInput);

    DOM.attachInputListener(newListBtn, newListInput, () => {
      const listName = newListInput.value;
      Storage.createList(listName, UI.currentBoardIndex);

      const newListIndex =
        Storage.boards[UI.currentBoardIndex].lists.length - 1;
      DOM.createList(UI.currentBoardIndex, newListIndex);
    });
  }

  static wipeBoard() {
    DOM.currentBoard.textContent = "";
  }

  // constructs the whole board, including all lists and cards
  static constructBoard(boardIndex) {
    // reconstruct last selected board
    DOM.createBoard(boardIndex);

    // reconstruct lists
    const currentBoard = Storage.boards[boardIndex];
    currentBoard.lists.forEach((list, listIndex) => {
      DOM.createList(boardIndex, listIndex);

      // reconstruct cards
      list.cards.forEach((card, cardIndex) => {
        DOM.createCard(boardIndex, listIndex, cardIndex);
      });
    });
  }

  // lists manipulation
  static createList(boardIndex, listIndex) {
    const board = document.querySelector(".board");

    const list = document.createElement("div");
    list.classList.add("list");
    list.dataset.index = listIndex;
    board.appendChild(list);

    const moveBackBtn = document.createElement("button");
    moveBackBtn.appendChild(DOM.createSVG(DOM.svgArrowsPaths[3]));
    moveBackBtn.classList.add("moveBackBtn");
    DOM.moveListListener(moveBackBtn);
    list.appendChild(moveBackBtn);

    const heading = document.createElement("h2");
    const headingInput = document.createElement("input");
    const name = Storage.boards[boardIndex].lists[listIndex].name;
    heading.classList.add("dynamicText");
    heading.textContent = name;
    list.appendChild(heading);

    headingInput.setAttribute("type", "text");
    headingInput.classList.add("headingInput", "dynamicInput");
    headingInput.value = name;
    list.appendChild(headingInput);

    DOM.attachInputListener(
      heading,
      headingInput,
      () => {
        const newName = headingInput.value;
        heading.textContent = newName;

        Storage.changeListName(
          newName,
          list.dataset.index,
          UI.currentBoardIndex
        );
      },
      false
    );

    const moveForwardBtn = document.createElement("button");
    moveForwardBtn.appendChild(DOM.createSVG(DOM.svgArrowsPaths[1]));
    moveForwardBtn.classList.add("moveForwardBtn");
    DOM.moveListListener(moveForwardBtn);
    list.appendChild(moveForwardBtn);

    const newCardBtn = document.createElement("button");
    const newCardInput = document.createElement("input");
    newCardBtn.classList.add("newCard", "dynamicText");
    newCardBtn.textContent = "+ Add a card";
    list.appendChild(newCardBtn);

    newCardInput.setAttribute("type", "text");
    newCardInput.classList.add("newCardInput", "dynamicInput");
    list.appendChild(newCardInput);

    DOM.attachInputListener(newCardBtn, newCardInput, () => {
      const cardName = newCardInput.value;
      const cardDescription = "";
      const cardPriority = "";

      const clickedListIndex = list.dataset.index;
      Storage.createCard(
        cardName,
        cardDescription,
        cardPriority,
        clickedListIndex,
        UI.currentBoardIndex
      );

      const newCardIndex =
        Storage.boards[UI.currentBoardIndex].lists[clickedListIndex].cards
          .length - 1;
      DOM.createCard(UI.currentBoardIndex, clickedListIndex, newCardIndex);
    });

    const kebabBtn = document.createElement("button");
    kebabBtn.classList.add("kebabBtn");
    kebabBtn.appendChild(
      DOM.createSVG(
        "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
      )
    );
    kebabBtn.onclick = () => {
      DOM.createKebabMenu(kebabBtn);
    };
    list.appendChild(kebabBtn);
  }

  // cards manipulation
  static createCard(boardIndex, listIndex, cardIndex) {
    const list = document.querySelector(`.list[data-index="${listIndex}"]`);

    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = cardIndex;
    list.appendChild(card);

    const cardObject =
      Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];

    const title = document.createElement("h3"); // the clickable "card" part of the card
    title.textContent = cardObject.title;

    // show modal when card is clicked
    title.addEventListener("click", (e) => {
      const modal = document.querySelector(".modalWrapper");
      const clickedCardIndex = card.dataset.index;
      const clickedListIndex = list.dataset.index;

      // update the last clicked card
      DOM.lastCard = e.target.parentNode;

      // populate the modal with current card's properties
      // and fill inputs with the properties too
      const cardTitleText = modal.querySelector("h2.title");
      const cardTitleInput = modal.querySelector("input.title");
      cardTitleText.textContent = cardObject.title;
      cardTitleInput.value = cardObject.title;

      const cardDescriptionText = modal.querySelector(
        "p.description.dynamicText"
      );
      const cardDescriptionInput = modal.querySelector("textarea.description");
      cardDescriptionText.textContent = cardObject.description;
      cardDescriptionInput.value = cardObject.description;
      if (cardObject.description === "") {
        cardDescriptionText.textContent = "Add a more detailed description...";
      }

      // make modal visible
      modal.style.display = "flex";

      // dynamic input for description
      DOM.attachInputListener(
        cardDescriptionText,
        cardDescriptionInput,
        () => {
          const newDescription = cardDescriptionInput.value;

          // change description in modal
          cardDescriptionText.textContent = newDescription;

          // update storage
          Storage.changeCardDescription(
            newDescription,
            clickedCardIndex,
            clickedListIndex,
            UI.currentBoardIndex
          );
        },
        false
      );
    });

    card.appendChild(title);

    const moveUpBtn = document.createElement("button");
    moveUpBtn.appendChild(DOM.createSVG(DOM.svgArrowsPaths[0]));
    moveUpBtn.classList.add("moveUpBtn");
    DOM.moveCardListener(moveUpBtn);
    card.appendChild(moveUpBtn);

    const moveDownBtn = document.createElement("button");
    moveDownBtn.appendChild(DOM.createSVG(DOM.svgArrowsPaths[2]));
    moveDownBtn.classList.add("moveDownBtn");
    DOM.moveCardListener(moveDownBtn);
    card.appendChild(moveDownBtn);
  }
}
