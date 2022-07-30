import UI from "./UI";
import Storage from "./Storage";

export default class DOM {
  static currentBoard;
  static sidebar;
  static svgArrowsPaths;

  static {
    DOM.currentBoard = document.querySelector(".currentBoard");
    DOM.sidebar = document.querySelector(".sidebar");
    DOM.svgArrowsPaths = [ // up, right, down, left
      "M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z",
      "M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z",
      "M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z",
      "M20,9V15H12V19.84L4.16,12L12,4.16V9H20Z"
    ]
  }


  static updateIndexes(parentNode) {
    // everytime you delete/move element in DOM, the indexes
    // need to be updated to match the storage
    // to prevent indexes going: "0, 1, 3, 4, 5"
    const elements = parentNode.querySelectorAll(":scope > [data-index]")
    elements.forEach((element, newIndex) => {
      element.dataset.index = newIndex;
    })
  }


  static attachInputListener(textElement, inputElement, processCallback, wipeInput = true) {
    // Event listener that dynamically swaps visibility of
    // text element to input element when you click on text element.
    // When you lose focus or press enter, it executes the callback
    // funtion and swaps back to text element.
    textElement.addEventListener("click", () => {
      function sendInput() {
        if (inputElement.value !== "") {
          textElement.classList.remove("active");
          inputElement.classList.remove("active");
          
          processCallback();
          if (wipeInput) {inputElement.value = ""}; // wipe out the input by default, so you always start fresh
        }
        else {
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
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          sendInput();
        }
        if (e.key === "Escape") {
          inputElement.value = "";
          sendInput();
          inputElement.value = textElement.textContent;
        }
      })
    })
  }


  static moveListListener(directionBtn) {
    directionBtn.addEventListener("click", () => {
      const list = directionBtn.parentNode;
      const listIndex = parseInt(list.dataset.index);
      const lists = document.querySelectorAll(".list");
      const direction = directionBtn.classList[0];

      // also makes sure you don't exceed array range
      if (direction === "moveBackBtn" && listIndex > 0) {
        Storage.moveList(listIndex, listIndex - 1, UI.currentBoardIndex);
        list.parentNode.insertBefore(list, lists[listIndex - 1]);
      }
      else if (direction === "moveForwardBtn" && listIndex < lists.length) {
        Storage.moveList(listIndex, listIndex + 1, UI.currentBoardIndex);
        list.parentNode.insertBefore(list, lists[listIndex + 2]);
      }      

      DOM.updateIndexes(list.parentNode);
    })
  }
  
  
  static moveCardListener(directionBtn) {
    directionBtn.addEventListener("click", () => {
      const card = directionBtn.parentNode;
      const cardIndex = parseInt(card.dataset.index);
      const cards = card.parentNode.querySelectorAll(".card");
      const listIndex = parseInt(card.parentNode.dataset.index);
      const direction = directionBtn.classList[0];

      // also makes sure you don't exceed array range
      if (direction === "moveUpBtn" && cardIndex > 0) {
        Storage.moveCard(cardIndex, cardIndex - 1, listIndex, UI.currentBoardIndex);
        card.parentNode.insertBefore(card, cards[cardIndex - 1]);
      }
      else if (direction === "moveDownBtn" && cardIndex < cards.length) {
        Storage.moveCard(cardIndex, cardIndex + 1, listIndex, UI.currentBoardIndex);
        card.parentNode.insertBefore(card, cards[cardIndex + 2]);
      }      

      DOM.updateIndexes(card.parentNode);
    })
  }


  static createSVG(customPath) {
    const SVG_NS = "http://www.w3.org/2000/svg"; 
    const SVG_Element = document.createElementNS(SVG_NS, "svg");
    SVG_Element.setAttribute("viewBox", "0 0 24 24");
  
    const SVG_Path_Element = document.createElementNS(SVG_NS, "path");
    SVG_Path_Element.setAttribute("fill", "currentColor");
    SVG_Path_Element.setAttribute("d", customPath);
    SVG_Element.appendChild(SVG_Path_Element);
  
    return SVG_Element;
  }

  
  // boards manipulation
  static createBoardBtn(boardIndex) {
    const boardBtn = document.createElement("button");
    const name = Storage.boards[boardIndex].name;
    boardBtn.textContent = name;
    boardBtn.dataset.index = boardIndex;
    DOM.sidebar.appendChild(boardBtn);

    boardBtn.addEventListener("click", (e) => {
      const boardIndex = e.target.dataset.index;
      // update and save new current board index
      UI.currentBoardIndex = boardIndex;
      Storage.setLocalStorage(); 

      DOM.constructBoard(boardIndex);
    })
  }

  static createBoard(boardIndex) {
    DOM.wipeBoard()

    const boardName = Storage.boards[boardIndex].name;

    const heading = document.createElement("h1");
    const renameInput = document.createElement("input");
    heading.classList.add("dynamicText");
    heading.textContent = boardName;
    DOM.currentBoard.appendChild(heading);

    renameInput.setAttribute("type", "text")
    renameInput.classList.add("rename", "dynamicInput");
    renameInput.value = boardName;
    DOM.currentBoard.appendChild(renameInput);
    
    DOM.attachInputListener(heading, renameInput, () => {
      const newName = renameInput.value;    
      const heading = DOM.currentBoard.querySelector("h1");
      heading.textContent = newName;
  
      const boardIndex = UI.currentBoardIndex;
      const boardLink = document.querySelector(`.sidebar>button[data-index="${boardIndex}"]`);
      boardLink.textContent = newName;
  
      Storage.changeBoardName(newName, boardIndex);
    }, false)


    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "Delete board";
    deleteBtn.addEventListener("click", () => {
      DOM.wipeBoard();

      const boardIndex = UI.currentBoardIndex;
      const boardLink = document.querySelector(`.sidebar>button[data-index="${boardIndex}"]`);
      boardLink.remove();

      // to prevent staying at undefined index when
      // when last item is deleted
      UI.currentBoardIndex = Storage.boards.length - 2;
      if (UI.currentBoardIndex < 0) {
        UI.currentBoardIndex = undefined;
      }

      DOM.updateIndexes(DOM.sidebar);

      Storage.deleteBoard(boardIndex);
    })
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

      const newListIndex = Storage.boards[UI.currentBoardIndex].lists.length - 1;
      DOM.createList(UI.currentBoardIndex, newListIndex);
    })
  }

  static wipeBoard() {
    DOM.currentBoard.textContent = "";
  }

  // constructs the whole board, including all lists and cards
  static constructBoard(boardIndex) {
    // reconstruct last selected board
    DOM.createBoard(boardIndex);

    //reconstruct lists
    const currentBoard = Storage.boards[boardIndex];
    currentBoard.lists.forEach((list, listIndex) => {
      DOM.createList(boardIndex, listIndex);

      //reconstruct cards
      list.cards.forEach((card, cardIndex) => {
        DOM.createCard(boardIndex, listIndex, cardIndex);
      })
    }) 
  }


  // lists manipulation
  static createList(boardIndex, listIndex) {
    const board = document.querySelector(".board");

    const list = document.createElement("div");
    list.classList.add("list");
    list.dataset.index = listIndex;
    board.appendChild(list);

    const moveBackBtn = document.createElement("button");
    moveBackBtn.appendChild(
      DOM.createSVG(DOM.svgArrowsPaths[3])
    );
    moveBackBtn.classList.add("moveBackBtn");
    DOM.moveListListener(moveBackBtn);
    list.appendChild(moveBackBtn);

    const heading = document.createElement("h2");
    const headingInput = document.createElement("input");
    const name = Storage.boards[boardIndex].lists[listIndex].name;
    heading.classList.add("dynamicText");
    heading.textContent = name;
    heading.addEventListener("click", () => {
    })
    list.appendChild(heading);
    
    headingInput.setAttribute("type", "text");
    headingInput.classList.add("headingInput", "dynamicInput");
    headingInput.value = name;
    list.appendChild(headingInput);
    
    DOM.attachInputListener(heading, headingInput, () => {
      const newName = headingInput.value;
      heading.textContent = newName;
  
      Storage.changeListName(newName, list.dataset.index, UI.currentBoardIndex);  
    }, false)
    
    const moveForwardBtn = document.createElement("button");
    moveForwardBtn.appendChild(
      DOM.createSVG(DOM.svgArrowsPaths[1])
    );
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
  
      const listIndex = list.dataset.index;
      Storage.createCard(cardName, cardDescription, cardPriority, listIndex, UI.currentBoardIndex);
  
      const newCardIndex = Storage.boards[UI.currentBoardIndex].lists[listIndex].cards.length - 1;
      DOM.createCard(UI.currentBoardIndex, listIndex, newCardIndex);
    })

    const removeListBtn = document.createElement("button");
    removeListBtn.classList.add("removeList");
    removeListBtn.textContent = "X";
    removeListBtn.addEventListener("click", () => {
      list.remove();
      
      Storage.removeList(list.dataset.index, UI.currentBoardIndex);
      
      DOM.updateIndexes(board);
    })
    list.appendChild(removeListBtn);
  }


  // cards manipulation 
  static createCard(boardIndex, listIndex, cardIndex) {
    const list = document.querySelector(`.list[data-index="${listIndex}"]`);

    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = cardIndex;
    list.appendChild(card);

    const cardObject = Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];
    
    
    const title = document.createElement("h3"); // the clickable "card" part of the card
    title.textContent = cardObject.title;
    
    // show modal when card is clicked
    title.addEventListener("click", () => {
      const modal = document.querySelector(".modalWrapper");
      const cardIndex = card.dataset.index;
      const listIndex = list.dataset.index;

      // populate the modal with current card's properties
      // and fill inputs with the properties too
      const cardTitleText = modal.querySelector("h2.title");
      const cardTitleInput = modal.querySelector("input.title");
      cardTitleText.textContent = cardObject.title;
      cardTitleInput.value = cardObject.title;

      const cardDescriptionText = modal.querySelector("p.description.dynamicText");
      const cardDescriptionInput = modal.querySelector("textarea.description");
      cardDescriptionText.textContent = cardObject.description;
      cardDescriptionInput.value = cardObject.description;

      const cardPriorityText = modal.querySelector("span.priority");
      const cardPriorityInput = modal.querySelector("input.priority");
      cardPriorityText.textContent = cardObject.priority;
      cardPriorityInput.value = cardObject.priority;

      // make modal visible
      modal.style.display = "flex";
      

      // dynamic input for title
      DOM.attachInputListener(cardTitleText, cardTitleInput, () => {
        const newTitle = cardTitleInput.value;

        // change card title in modal
        cardTitleText.textContent = newTitle;

        // change card title in list
        title.textContent = newTitle;

        // update storage
        Storage.changeCardTitle(newTitle, cardIndex, listIndex, UI.currentBoardIndex);
      }, false)
      
      
      // dynamic input for description
      DOM.attachInputListener(cardDescriptionText, cardDescriptionInput, () => {
        const newDescription = cardDescriptionInput.value;
        
        // change description in modal
        cardDescriptionText.textContent = newDescription;
        
        // update storage
        Storage.changeCardDescription(newDescription, cardIndex, listIndex, UI.currentBoardIndex);
      }, false)


      // dynamic input for priority
      DOM.attachInputListener(cardPriorityText, cardPriorityInput, () => {
        const newPriority = cardPriorityInput.value;

        // change priority in modal
        cardPriorityText.textContent = newPriority;

        // update storage
        Storage.changeCardPriority(newPriority, cardIndex, listIndex, UI.currentBoardIndex);
      }, false)


      // delete card button
      const deleteBtn = modal.querySelector(".delete")
      deleteBtn.addEventListener("click", () => {
        modal.style.display = "none";

        // delete card from list in DOM
        list.removeChild(card);

        // update storage
        Storage.removeCard(cardIndex, listIndex, UI.currentBoardIndex);
      })
    })

    // close modal when you click outside of modal or the "X" button
    window.addEventListener("click", (e) => {
      const modal = document.querySelector(".modalWrapper");
      const closeBtn = modal.querySelector(".close");
      if (e.target === modal || e.target === closeBtn) {
        modal.style.display = "none";
      }
    })

    card.appendChild(title);


    const moveUpBtn = document.createElement("button");
    moveUpBtn.appendChild(
      DOM.createSVG(DOM.svgArrowsPaths[0])
    );
    moveUpBtn.classList.add("moveUpBtn");
    DOM.moveCardListener(moveUpBtn);
    card.appendChild(moveUpBtn);
    
    const moveDownBtn = document.createElement("button");
    moveDownBtn.appendChild(
      DOM.createSVG(DOM.svgArrowsPaths[2])
    );
    moveDownBtn.classList.add("moveDownBtn");
    DOM.moveCardListener(moveDownBtn);
    card.appendChild(moveDownBtn);
  }
}