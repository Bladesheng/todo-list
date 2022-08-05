"use strict";
(self["webpackChunktodo_list"] = self["webpackChunktodo_list"] || []).push([["main"],{

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__webpack_require__(/*! ./style.scss */ "./src/style.scss");

var UI_1 = __webpack_require__(/*! ./modules/UI */ "./src/modules/UI.ts");

UI_1["default"].init();

/***/ }),

/***/ "./src/modules/Board.ts":
/*!******************************!*\
  !*** ./src/modules/Board.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Board = void 0;

var functions_1 = __webpack_require__(/*! ./functions */ "./src/modules/functions.ts");

var Board =
/** @class */
function () {
  function Board(name) {
    this.name = name;
    this.lists = [];
  }

  Board.prototype.changeName = function (newName) {
    this.name = newName;
  };

  Board.prototype.addList = function (list) {
    this.lists.push(list);
  };

  Board.prototype.removeList = function (listPosition) {
    this.lists.splice(listPosition, 1);
  };

  Board.prototype.moveList = function (oldPosition, newPosition) {
    (0, functions_1.arrayMove)(this.lists, oldPosition, newPosition);
  };

  return Board;
}();

exports.Board = Board;

/***/ }),

/***/ "./src/modules/Card.ts":
/*!*****************************!*\
  !*** ./src/modules/Card.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Card = void 0;

var Card =
/** @class */
function () {
  function Card(title, description, priority) {
    this.title = title;
    this.description = description;
    this.priority = priority;
  }

  Card.prototype.changeTitle = function (newTitle) {
    this.title = newTitle;
  };

  Card.prototype.changeDescription = function (newDescription) {
    this.description = newDescription;
  };

  Card.prototype.changePriority = function (newPriority) {
    this.priority = newPriority;
  };

  return Card;
}();

exports.Card = Card;

/***/ }),

/***/ "./src/modules/DOM.ts":
/*!****************************!*\
  !*** ./src/modules/DOM.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var UI_1 = __webpack_require__(/*! ./UI */ "./src/modules/UI.ts");

var Storage_1 = __webpack_require__(/*! ./Storage */ "./src/modules/Storage.ts");

var DOM =
/** @class */
function () {
  function DOM() {} // for deleting current card from modal


  DOM.modalDeleteListener = function () {
    var deleteBtn = document.querySelector(".modal>.delete"); //

    deleteBtn.addEventListener("click", function () {
      var list = DOM.lastCard.parentNode;
      var listIndex = parseInt(list.dataset.index);
      var cardIndex = parseInt(DOM.lastCard.dataset.index);
      var board = list.parentNode;
      var boardIndex = parseInt(board.dataset.index);
      var modalWrapper = document.querySelector(".modalWrapper");
      modalWrapper.style.display = "none"; // delete card from list in DOM

      list.removeChild(DOM.lastCard); // update storage

      Storage_1["default"].removeCard(cardIndex, listIndex, boardIndex);
    });
  }; // for changing name of card from modal


  DOM.modalTitleListener = function () {
    var cardTitleText = document.querySelector("h2.title");
    var cardTitleInput = document.querySelector("input.title");
    DOM.attachInputListener(cardTitleText, cardTitleInput, function () {
      var newTitle = cardTitleInput.value;
      var list = DOM.lastCard.parentNode;
      var cardIndex = parseInt(DOM.lastCard.dataset.index);
      var listIndex = parseInt(list.dataset.index);
      var board = list.parentNode;
      var boardIndex = parseInt(board.dataset.index);
      var title = DOM.lastCard.querySelector("h3"); // change card title in modal

      cardTitleText.textContent = newTitle; // change card title in list

      title.textContent = newTitle; // update storage

      Storage_1["default"].changeCardTitle(newTitle, cardIndex, listIndex, boardIndex);
    }, false);
  };

  DOM.updateIndexes = function (parentNode) {
    // everytime you delete/move element in DOM, the indexes
    // need to be updated to match the storage
    // to prevent indexes going: "0, 1, 3, 4, 5"
    var elements = parentNode.querySelectorAll(":scope > [data-index]");
    elements.forEach(function (element, newIndex) {
      element.dataset.index = String(newIndex);
    });
  };

  DOM.attachInputListener = function (textElement, inputElement, processCallback, wipeInput) {
    if (wipeInput === void 0) {
      wipeInput = true;
    } // Event listener that dynamically swaps visibility of
    // text element to input element when you click on text element.
    // When you lose focus or press enter, it executes the callback
    // function and swaps back to text element.


    textElement.addEventListener("click", function () {
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
      } // hides the text, shows the input and focuses it


      textElement.classList.add("active");
      inputElement.classList.add("active");
      inputElement.focus(); // when you lose focus by clicking somewhere outside the input

      inputElement.onblur = function () {
        sendInput();
      };

      inputElement.onkeydown = function (e) {
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
  };

  DOM.moveListListener = function (directionBtn) {
    directionBtn.addEventListener("click", function () {
      var list = directionBtn.parentNode;
      var listIndex = parseInt(list.dataset.index, 10);
      var lists = document.querySelectorAll(".list");
      var direction = directionBtn.classList[0]; // also makes sure you don't exceed array range

      if (direction === "moveBackBtn" && listIndex > 0) {
        Storage_1["default"].moveList(listIndex, listIndex - 1, UI_1["default"].currentBoardIndex);
        list.parentNode.insertBefore(list, lists[listIndex - 1]);
      } else if (direction === "moveForwardBtn" && listIndex < lists.length) {
        Storage_1["default"].moveList(listIndex, listIndex + 1, UI_1["default"].currentBoardIndex);
        list.parentNode.insertBefore(list, lists[listIndex + 2]);
      }

      DOM.updateIndexes(list.parentNode);
    });
  };

  DOM.moveCardListener = function (directionBtn) {
    directionBtn.addEventListener("click", function () {
      var card = directionBtn.parentNode;
      var cardIndex = parseInt(card.dataset.index, 10);
      var cards = card.parentNode.querySelectorAll(".card");
      var list = card.parentNode;
      var listIndex = parseInt(list.dataset.index, 10);
      var direction = directionBtn.classList[0]; // also makes sure you don't exceed array range

      if (direction === "moveUpBtn" && cardIndex > 0) {
        Storage_1["default"].moveCard(cardIndex, cardIndex - 1, listIndex, UI_1["default"].currentBoardIndex);
        card.parentNode.insertBefore(card, cards[cardIndex - 1]);
      } else if (direction === "moveDownBtn" && cardIndex < cards.length) {
        Storage_1["default"].moveCard(cardIndex, cardIndex + 1, listIndex, UI_1["default"].currentBoardIndex);
        card.parentNode.insertBefore(card, cards[cardIndex + 2]);
      }

      DOM.updateIndexes(card.parentNode);
    });
  };

  DOM.createSVG = function (customPath) {
    var SVG_NS = "http://www.w3.org/2000/svg";
    var SVGElement = document.createElementNS(SVG_NS, "svg");
    SVGElement.setAttribute("viewBox", "0 0 24 24");
    var SVGPathElement = document.createElementNS(SVG_NS, "path");
    SVGPathElement.setAttribute("fill", "currentColor");
    SVGPathElement.setAttribute("d", customPath);
    SVGElement.appendChild(SVGPathElement);
    return SVGElement;
  };

  DOM.createKebabMenu = function (kebabBtn) {
    var kebabMenu = document.createElement("div");
    kebabMenu.classList.add("menu");
    var removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove this list";
    removeBtn.classList.add("removeList");
    kebabMenu.appendChild(removeBtn);
    kebabBtn.parentNode.appendChild(kebabMenu); // delete list button

    removeBtn.onmousedown = function (event) {
      // blur event would result in this listener being removed before
      // execution, so we prevent the blur and execute this listener's callback
      event.preventDefault(); // remove the list from DOM and from Storage

      var list = kebabBtn.parentNode;
      var listIndex = parseInt(list.dataset.index);
      list.remove();
      Storage_1["default"].removeList(listIndex, UI_1["default"].currentBoardIndex);
      var board = document.querySelector(".board");
      DOM.updateIndexes(board);
    };

    function closeMenu() {
      // remove the menu from DOM
      kebabMenu.remove(); // add the original listener to kebab button again

      kebabBtn.onclick = function () {
        DOM.createKebabMenu(kebabBtn);
      };
    } // close menu when you lose focus or click the kebab button again


    kebabBtn.onblur = function () {
      closeMenu();
    };

    kebabBtn.onclick = function () {
      closeMenu();
    };
  };

  DOM.sidebarSwipeListener = function () {
    // hide sidebar when you swipe left
    // show sidebar when you swipe right (and you are on left side of page)
    var mainNode = document.querySelector("main");
    var touchStartX = 0;
    var touchEndX = 0;
    var scrollLeftStart;

    function checkDirection() {
      var sidebar = document.querySelector(".sidebar"); // swiped left

      if (touchEndX < touchStartX) {
        sidebar.classList.add("hidden");
      } // swiped right


      if (touchEndX > touchStartX) {
        // only if you are scrolled to the left side of page
        if (scrollLeftStart === 0) {
          sidebar.classList.remove("hidden");
        }
      }
    }

    document.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
      scrollLeftStart = mainNode.scrollLeft;
    });
    document.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      checkDirection();
    });
  }; // boards manipulation


  DOM.createBoardBtn = function (boardIndex) {
    var boardBtn = document.createElement("button");
    var name = Storage_1["default"].boards[boardIndex].name;
    boardBtn.textContent = name;
    boardBtn.dataset.index = String(boardIndex);
    DOM.sidebar.appendChild(boardBtn);
    boardBtn.addEventListener("click", function (e) {
      var clickedBoard = e.target;
      var clickedBoardIndex = parseInt(clickedBoard.dataset.index); // update and save new current board index

      UI_1["default"].currentBoardIndex = clickedBoardIndex;
      Storage_1["default"].setLocalStorage();
      DOM.constructBoard(clickedBoardIndex);
    });
  };

  DOM.createBoard = function (boardIndex) {
    DOM.wipeBoard();
    var boardName = Storage_1["default"].boards[boardIndex].name;
    var heading = document.createElement("h1");
    var renameInput = document.createElement("input");
    heading.classList.add("dynamicText");
    heading.textContent = boardName;
    DOM.currentBoard.appendChild(heading);
    renameInput.setAttribute("type", "text");
    renameInput.classList.add("rename", "dynamicInput");
    renameInput.value = boardName;
    DOM.currentBoard.appendChild(renameInput);
    DOM.attachInputListener(heading, renameInput, function () {
      var newName = renameInput.value;
      var clickedHeading = DOM.currentBoard.querySelector("h1");
      clickedHeading.textContent = newName;
      var clickedBoardIndex = UI_1["default"].currentBoardIndex;
      var boardLink = document.querySelector(".sidebar>button[data-index=\"".concat(clickedBoardIndex, "\"]"));
      boardLink.textContent = newName;
      Storage_1["default"].changeBoardName(newName, clickedBoardIndex);
    }, false);
    var deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "Delete board";
    deleteBtn.addEventListener("click", function () {
      DOM.wipeBoard();
      var clickedBoardIndex = UI_1["default"].currentBoardIndex;
      var boardLink = document.querySelector(".sidebar>button[data-index=\"".concat(clickedBoardIndex, "\"]"));
      boardLink.remove(); // to prevent staying at undefined index when
      // when last item is deleted

      UI_1["default"].currentBoardIndex = Storage_1["default"].boards.length - 2;

      if (UI_1["default"].currentBoardIndex < 0) {
        UI_1["default"].currentBoardIndex = undefined;
      }

      DOM.updateIndexes(DOM.sidebar);
      Storage_1["default"].deleteBoard(clickedBoardIndex);
    });
    DOM.currentBoard.appendChild(deleteBtn);
    var board = document.createElement("div");
    board.classList.add("board");
    board.dataset.index = String(boardIndex);
    DOM.currentBoard.appendChild(board);
    var newListBtn = document.createElement("button");
    var newListInput = document.createElement("input");
    newListBtn.classList.add("newList", "dynamicText");
    newListBtn.textContent = "+ Add another list";
    board.appendChild(newListBtn);
    newListInput.setAttribute("type", "text");
    newListInput.classList.add("newList", "dynamicInput");
    board.appendChild(newListInput);
    DOM.attachInputListener(newListBtn, newListInput, function () {
      var listName = newListInput.value;
      Storage_1["default"].createList(listName, UI_1["default"].currentBoardIndex);
      var newListIndex = Storage_1["default"].boards[UI_1["default"].currentBoardIndex].lists.length - 1;
      DOM.createList(UI_1["default"].currentBoardIndex, newListIndex);
    });
  };

  DOM.wipeBoard = function () {
    DOM.currentBoard.textContent = "";
  }; // constructs the whole board, including all lists and cards


  DOM.constructBoard = function (boardIndex) {
    // reconstruct last selected board
    DOM.createBoard(boardIndex); // reconstruct lists

    var currentBoard = Storage_1["default"].boards[boardIndex];
    currentBoard.lists.forEach(function (list, listIndex) {
      DOM.createList(boardIndex, listIndex); // reconstruct cards

      list.cards.forEach(function (card, cardIndex) {
        DOM.createCard(boardIndex, listIndex, cardIndex);
      });
    });
  }; // lists manipulation


  DOM.createList = function (boardIndex, listIndex) {
    var board = document.querySelector(".board");
    var list = document.createElement("div");
    list.classList.add("list");
    list.dataset.index = String(listIndex);
    board.appendChild(list);
    var moveBackBtn = document.createElement("button");
    moveBackBtn.appendChild(DOM.createSVG(DOM.svgArrowsPaths[3]));
    moveBackBtn.classList.add("moveBackBtn");
    DOM.moveListListener(moveBackBtn);
    list.appendChild(moveBackBtn);
    var heading = document.createElement("h2");
    var headingInput = document.createElement("input");
    var name = Storage_1["default"].boards[boardIndex].lists[listIndex].name;
    heading.classList.add("dynamicText");
    heading.textContent = name;
    list.appendChild(heading);
    headingInput.setAttribute("type", "text");
    headingInput.classList.add("headingInput", "dynamicInput");
    headingInput.value = name;
    list.appendChild(headingInput);
    DOM.attachInputListener(heading, headingInput, function () {
      var newName = headingInput.value;
      heading.textContent = newName;
      var selectedListIndex = parseInt(list.dataset.index);
      Storage_1["default"].changeListName(newName, selectedListIndex, UI_1["default"].currentBoardIndex);
    }, false);
    var moveForwardBtn = document.createElement("button");
    moveForwardBtn.appendChild(DOM.createSVG(DOM.svgArrowsPaths[1]));
    moveForwardBtn.classList.add("moveForwardBtn");
    DOM.moveListListener(moveForwardBtn);
    list.appendChild(moveForwardBtn);
    var newCardBtn = document.createElement("button");
    var newCardInput = document.createElement("input");
    newCardBtn.classList.add("newCard", "dynamicText");
    newCardBtn.textContent = "+ Add a card";
    list.appendChild(newCardBtn);
    newCardInput.setAttribute("type", "text");
    newCardInput.classList.add("newCardInput", "dynamicInput");
    list.appendChild(newCardInput);
    DOM.attachInputListener(newCardBtn, newCardInput, function () {
      var cardName = newCardInput.value;
      var cardDescription = "";
      var cardPriority = 0;
      var clickedListIndex = parseInt(list.dataset.index);
      Storage_1["default"].createCard(cardName, cardDescription, cardPriority, clickedListIndex, UI_1["default"].currentBoardIndex);
      var newCardIndex = Storage_1["default"].boards[UI_1["default"].currentBoardIndex].lists[clickedListIndex].cards.length - 1;
      DOM.createCard(UI_1["default"].currentBoardIndex, clickedListIndex, newCardIndex);
    });
    var kebabBtn = document.createElement("button");
    kebabBtn.classList.add("kebabBtn");
    kebabBtn.appendChild(DOM.createSVG("M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"));

    kebabBtn.onclick = function () {
      DOM.createKebabMenu(kebabBtn);
    };

    list.appendChild(kebabBtn);
  }; // cards manipulation


  DOM.createCard = function (boardIndex, listIndex, cardIndex) {
    var list = document.querySelector(".list[data-index=\"".concat(listIndex, "\"]"));
    var card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = String(cardIndex);
    list.appendChild(card);
    var cardObject = Storage_1["default"].boards[boardIndex].lists[listIndex].cards[cardIndex];
    var title = document.createElement("h3"); // the clickable "card" part of the card

    title.textContent = cardObject.title; // show modal when card is clicked

    title.addEventListener("click", function (e) {
      var modal = document.querySelector(".modalWrapper");
      var clickedCardIndex = parseInt(card.dataset.index);
      var clickedListIndex = parseInt(list.dataset.index); // update the last clicked card

      var clickedCard = e.target.parentNode;
      DOM.lastCard = clickedCard; // populate the modal with current card's properties
      // and fill inputs with the properties too

      var cardTitleText = modal.querySelector("h2.title");
      var cardTitleInput = modal.querySelector("input.title");
      cardTitleText.textContent = cardObject.title;
      cardTitleInput.value = cardObject.title;
      var cardDescriptionText = modal.querySelector("p.description.dynamicText");
      var cardDescriptionInput = modal.querySelector("textarea.description");
      cardDescriptionText.textContent = cardObject.description;
      cardDescriptionInput.value = cardObject.description;

      if (cardObject.description === "") {
        cardDescriptionText.textContent = "Add a more detailed description...";
      } // make modal visible


      modal.style.display = "flex"; // dynamic input for description

      DOM.attachInputListener(cardDescriptionText, cardDescriptionInput, function () {
        var newDescription = cardDescriptionInput.value; // change description in modal

        cardDescriptionText.textContent = newDescription; // update storage

        Storage_1["default"].changeCardDescription(newDescription, clickedCardIndex, clickedListIndex, UI_1["default"].currentBoardIndex);
      }, false);
    });
    card.appendChild(title);
    var moveUpBtn = document.createElement("button");
    moveUpBtn.appendChild(DOM.createSVG(DOM.svgArrowsPaths[0]));
    moveUpBtn.classList.add("moveUpBtn");
    DOM.moveCardListener(moveUpBtn);
    card.appendChild(moveUpBtn);
    var moveDownBtn = document.createElement("button");
    moveDownBtn.appendChild(DOM.createSVG(DOM.svgArrowsPaths[2]));
    moveDownBtn.classList.add("moveDownBtn");
    DOM.moveCardListener(moveDownBtn);
    card.appendChild(moveDownBtn);
  };

  return DOM;
}();

exports["default"] = DOM;

(function () {
  DOM.currentBoard = document.querySelector(".currentBoard");
  DOM.sidebar = document.querySelector(".sidebar");
  DOM.svgArrowsPaths = [// up, right, down, left
  "M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z", "M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z", "M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z", "M20,9V15H12V19.84L4.16,12L12,4.16V9H20Z"]; // horizontal mouse scrolling

  window.addEventListener("wheel", function (e) {
    var container = document.querySelector("main");
    if (e.deltaY > 0) container.scrollLeft += 100;else container.scrollLeft -= 100;
  }); // close modal when you click outside of modal or the "X" button

  var modalWrapper = document.querySelector(".modalWrapper");
  modalWrapper.addEventListener("click", function (e) {
    if (e.target === modalWrapper) {
      modalWrapper.style.display = "none";
    }
  }); // modal - close modal button

  var closeBtn = modalWrapper.querySelector(".close");
  closeBtn.addEventListener("click", function () {
    modalWrapper.style.display = "none";
  }); // modal - delete card button

  DOM.modalDeleteListener(); // modal - dynamic input for title

  DOM.modalTitleListener(); // textarea automatic resizing

  var modalTextarea = document.querySelector("textarea.description");
  modalTextarea.addEventListener("focus", function () {
    function resize() {
      modalTextarea.style.height = "";
      modalTextarea.style.height = "".concat(modalTextarea.scrollHeight + 6, " + \"px\"");
    } // initial resize on focus


    resize(); // resize automatically when typing

    modalTextarea.oninput = function () {
      resize();
    };
  }); // show sidebar when button is clicked

  var hamburgerBtn = document.querySelector("button.burger");
  var sidebar = document.querySelector(".sidebar");
  hamburgerBtn.addEventListener("click", function () {
    sidebar.classList.remove("hidden");
  }); // hide sidebar when you click somewhere else

  DOM.currentBoard.addEventListener("click", function () {
    sidebar.classList.add("hidden");
  }); // hide/show sidebar by swiping on phone

  DOM.sidebarSwipeListener();
})();

/***/ }),

/***/ "./src/modules/List.ts":
/*!*****************************!*\
  !*** ./src/modules/List.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.List = void 0;

var functions_1 = __webpack_require__(/*! ./functions */ "./src/modules/functions.ts");

var List =
/** @class */
function () {
  function List(name) {
    this.name = name;
    this.cards = [];
  }

  List.prototype.changeName = function (newName) {
    this.name = newName;
  };

  List.prototype.addCard = function (card) {
    this.cards.push(card);
  };

  List.prototype.removeCard = function (cardPosition) {
    this.cards.splice(cardPosition, 1);
  };

  List.prototype.moveCard = function (oldPosition, newPosition) {
    (0, functions_1.arrayMove)(this.cards, oldPosition, newPosition);
  };

  return List;
}();

exports.List = List;

/***/ }),

/***/ "./src/modules/Storage.ts":
/*!********************************!*\
  !*** ./src/modules/Storage.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var Board_1 = __webpack_require__(/*! ./Board */ "./src/modules/Board.ts");

var List_1 = __webpack_require__(/*! ./List */ "./src/modules/List.ts");

var Card_1 = __webpack_require__(/*! ./Card */ "./src/modules/Card.ts");

var UI_1 = __webpack_require__(/*! ./UI */ "./src/modules/UI.ts");

var Storage =
/** @class */
function () {
  function Storage() {} // local storage


  Storage.getLocalStorage = function () {
    Storage.boards = [];

    if (localStorage.getItem("boards") !== null) {
      // if boards local storage isn't empty
      // the json can't store functions, so all the objects need to be remade
      // recreate board objects
      var jsonBoards = JSON.parse(localStorage.getItem("boards"));
      jsonBoards.forEach(function (jsonBoard) {
        var board = new Board_1.Board(jsonBoard.name); // recreate list objects

        var jsonLists = jsonBoard.lists;
        jsonLists.forEach(function (jsonList) {
          var list = new List_1.List(jsonList.name);
          board.addList(list); // recreate card objects

          var jsonCards = jsonList.cards;
          jsonCards.forEach(function (jsonCard) {
            var card = new Card_1.Card(jsonCard.title, jsonCard.description, jsonCard.priority);
            list.addCard(card);
          });
        }); // push the newly created board object straight into storage

        Storage.boards.push(board);
      });
      UI_1["default"].currentBoardIndex = parseInt(localStorage.getItem("lastBoard"));
      console.log(Storage.boards);
    }
  };

  Storage.setLocalStorage = function () {
    localStorage.setItem("boards", JSON.stringify(Storage.boards));
    localStorage.setItem("lastBoard", String(UI_1["default"].currentBoardIndex));
  }; // boards manipulation


  Storage.createBoard = function (name) {
    var newBoard = new Board_1.Board(name);
    Storage.boards.push(newBoard);
    Storage.setLocalStorage();
    return Storage.boards.length - 1; // return index of the new board
  };

  Storage.changeBoardName = function (newName, boardIndex) {
    var board = Storage.boards[boardIndex];
    board.changeName(newName);
    Storage.setLocalStorage();
  };

  Storage.deleteBoard = function (boardIndex) {
    Storage.boards.splice(boardIndex, 1);
    Storage.setLocalStorage();
  }; // lists manipulation


  Storage.createList = function (name, boardIndex) {
    var board = Storage.boards[boardIndex];
    var list = new List_1.List(name);
    board.addList(list);
    Storage.setLocalStorage();
  };

  Storage.changeListName = function (newName, listIndex, boardIndex) {
    var list = Storage.boards[boardIndex].lists[listIndex];
    list.changeName(newName);
    Storage.setLocalStorage();
  };

  Storage.moveList = function (oldPosition, newPosition, boardIndex) {
    Storage.boards[boardIndex].moveList(oldPosition, newPosition);
    Storage.setLocalStorage();
  };

  Storage.removeList = function (listIndex, boardIndex) {
    Storage.boards[boardIndex].removeList(listIndex);
    Storage.setLocalStorage();
  }; // cards manipulation


  Storage.createCard = function (name, description, priority, listIndex, boardIndex) {
    var list = Storage.boards[boardIndex].lists[listIndex];
    var card = new Card_1.Card(name, description, priority);
    list.addCard(card);
    Storage.setLocalStorage();
  };

  Storage.removeCard = function (cardPosition, listIndex, boardIndex) {
    var list = Storage.boards[boardIndex].lists[listIndex];
    list.removeCard(cardPosition);
    Storage.setLocalStorage();
  };

  Storage.moveCard = function (oldPosition, newPosition, listIndex, boardIndex) {
    var list = Storage.boards[boardIndex].lists[listIndex];
    list.moveCard(oldPosition, newPosition);
    Storage.setLocalStorage();
  };

  Storage.changeCardTitle = function (newTitle, cardIndex, listIndex, boardIndex) {
    var card = Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];
    card.changeTitle(newTitle);
    Storage.setLocalStorage();
  };

  Storage.changeCardDescription = function (newDescription, cardIndex, listIndex, boardIndex) {
    var card = Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];
    card.changeDescription(newDescription);
    Storage.setLocalStorage();
  };

  Storage.changeCardPriority = function (newPriority, cardIndex, listIndex, boardIndex) {
    var card = Storage.boards[boardIndex].lists[listIndex].cards[cardIndex];
    card.changePriority(newPriority);
    Storage.setLocalStorage();
  };

  return Storage;
}();

exports["default"] = Storage;

(function () {
  Storage.getLocalStorage();
})();

/***/ }),

/***/ "./src/modules/UI.ts":
/*!***************************!*\
  !*** ./src/modules/UI.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var Storage_1 = __webpack_require__(/*! ./Storage */ "./src/modules/Storage.ts");

var DOM_1 = __webpack_require__(/*! ./DOM */ "./src/modules/DOM.ts");

var UI =
/** @class */
function () {
  function UI() {}

  UI.init = function () {
    if (localStorage.getItem("boards") !== null && localStorage.getItem("boards") !== "[]") {
      // reconstruct board links (in sidebar) from local storage
      Storage_1["default"].boards.forEach(function (board, boardIndex) {
        DOM_1["default"].createBoardBtn(boardIndex);
      });
      DOM_1["default"].constructBoard(UI.currentBoardIndex);
    }

    var newBoardBtn = document.querySelector("button.newBoard");
    var newBoardInput = document.querySelector("input.newBoard");
    DOM_1["default"].attachInputListener(newBoardBtn, newBoardInput, function () {
      var userInput = newBoardInput.value;
      var boardIndex = Storage_1["default"].createBoard(userInput);
      DOM_1["default"].createBoardBtn(boardIndex);
      UI.currentBoardIndex = boardIndex;
      Storage_1["default"].setLocalStorage(); // to save the new current board index

      console.log(Storage_1["default"].boards);
    });
  };

  return UI;
}();

exports["default"] = UI;

/***/ }),

/***/ "./src/modules/functions.ts":
/*!**********************************!*\
  !*** ./src/modules/functions.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.arrayMove = void 0;

function arrayMove(array, fromIndex, toIndex) {
  var item = array[fromIndex];
  array.splice(fromIndex, 1);
  array.splice(toIndex, 0, item);
}

exports.arrayMove = arrayMove;

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style.scss":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style.scss ***!
  \*****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  padding: 0;\n  margin: 0;\n  box-sizing: border-box;\n}\n\nhtml {\n  height: -webkit-fill-available;\n}\n\nbody {\n  height: 100vh;\n  min-height: 100vh;\n  min-height: -webkit-fill-available;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  font-family: \"Roboto\", sans-serif;\n  color: rgb(199, 196, 189);\n  background-color: rgb(26, 28, 30);\n}\n\nbutton,\ninput {\n  font-family: \"Roboto\", sans-serif;\n}\n\n.dynamicText,\n.dynamicInput {\n  order: 1;\n}\n\n.dynamicText.active {\n  display: none;\n}\n\n.dynamicInput {\n  display: none;\n}\n\n.dynamicInput.active {\n  display: inline-block;\n}\n\n::-webkit-scrollbar {\n  height: 5px;\n}\n\n::-webkit-scrollbar-thumb {\n  background: rgb(64, 64, 64);\n}\n\n.modalWrapper {\n  display: none;\n  position: fixed;\n  z-index: 4;\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  justify-content: center;\n  align-items: center;\n}\n.modalWrapper .modal {\n  background-color: rgb(26, 28, 30);\n  padding: 2rem;\n  border-radius: 5px;\n  display: grid;\n  grid-template-columns: 55vw 1.5rem;\n  grid-template-rows: 3rem 1rem auto 1.3rem;\n  row-gap: 1rem;\n  align-items: center;\n}\n.modalWrapper .modal h2.title {\n  grid-column: 1/2;\n  grid-row: 1/2;\n  cursor: pointer;\n}\n.modalWrapper .modal input.title {\n  grid-column: 1/2;\n  grid-row: 1/2;\n  padding: 0.2em;\n  background-color: rgb(24, 26, 27);\n  border: 2px solid rgb(35, 92, 153);\n  border-radius: 3px;\n  outline: none;\n  color: rgb(199, 196, 189);\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1.5rem;\n  font-weight: 600;\n  margin-left: -0.284em;\n}\n.modalWrapper .modal button.close {\n  background: none;\n  border: none;\n  color: rgb(199, 196, 189);\n  cursor: pointer;\n}\n.modalWrapper .modal button.close svg {\n  height: 1.5rem;\n}\n.modalWrapper .modal button.close:hover {\n  filter: brightness(1.3);\n}\n.modalWrapper .modal div.description {\n  font-weight: 500;\n}\n.modalWrapper .modal p.description.dynamicText {\n  grid-column: 1/3;\n  grid-row: 3/4;\n  padding: 0.69em 0;\n  padding-right: 0.5em;\n  padding-top: 0.69em;\n  cursor: pointer;\n}\n.modalWrapper .modal textarea.description {\n  grid-column: 1/3;\n  grid-row: 3/4;\n  padding: 0.5em;\n  margin-left: -0.63em;\n  position: relative;\n  top: 1px;\n  left: 0.1px;\n  background-color: rgb(24, 26, 27);\n  border: 2px solid rgb(35, 92, 153);\n  border-radius: 3px;\n  outline: none;\n  color: rgb(199, 196, 189);\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 400;\n  font-size: 1rem;\n  resize: none;\n}\n.modalWrapper .modal .delete {\n  grid-row: 4/5;\n  grid-column: 2/3;\n  background: none;\n  border: none;\n  color: rgb(199, 196, 189);\n}\n.modalWrapper .modal .delete svg {\n  height: 1.3rem;\n}\n.modalWrapper .modal .delete:hover {\n  filter: brightness(1.3);\n}\n\nmain {\n  flex: 1 1 auto;\n  width: 100%;\n  overflow-x: scroll;\n  display: grid;\n  grid-template-columns: 40vw auto;\n  grid-template-rows: 1fr auto;\n}\nmain .sidebar {\n  grid-column: 1/2;\n  grid-row: 1/3;\n  z-index: 3;\n  position: relative;\n  left: 0;\n  transition: left 0.4s ease;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  padding: 10%;\n  background-color: rgb(26, 28, 30);\n}\nmain .sidebar .logo {\n  display: flex;\n  align-items: center;\n  gap: 0.3em;\n  padding-bottom: 0.7rem;\n}\nmain .sidebar .logo svg {\n  height: 1.1rem;\n}\nmain .sidebar .logo h1 {\n  font-size: 1rem;\n}\nmain .sidebar button,\nmain .sidebar input {\n  text-align: start;\n  padding: 0.7em 0.2em;\n  border: none;\n  border-radius: 3px;\n  background: none;\n  color: rgb(199, 196, 189);\n  font-weight: 500;\n  cursor: pointer;\n}\nmain .sidebar button:hover {\n  background-color: rgb(46, 49, 53);\n}\nmain .sidebar button.newBoard {\n  font-weight: 400;\n}\nmain .sidebar input.newBoard {\n  position: relative;\n  right: 2px;\n  bottom: 2px;\n  background-color: rgb(46, 49, 53);\n  outline: none;\n  border: 2px solid rgb(35, 92, 153);\n}\nmain .sidebar.hidden {\n  left: -40vw;\n  transition: left 0.4s ease;\n}\nmain button.burger {\n  position: fixed;\n  z-index: 2;\n  margin: 15px 0 0 15px;\n  width: 30px;\n  height: 30px;\n  border: none;\n  background: none;\n  cursor: pointer;\n}\nmain button.burger svg {\n  height: 30px;\n  color: rgb(199, 196, 189);\n}\nmain .currentBoard {\n  grid-column: 1/3;\n  grid-row: 1/3;\n  z-index: 1;\n  display: grid;\n  grid-template-columns: auto auto;\n  grid-template-rows: 2.5rem 1fr;\n  gap: 0.8rem;\n  background-color: black;\n  padding: 10px;\n}\nmain .currentBoard > .dynamicText,\nmain .currentBoard > .dynamicInput {\n  order: 0;\n}\nmain .currentBoard h1 {\n  position: fixed;\n  padding: 0.3em;\n  margin-left: 3rem;\n  margin-top: 0.3em;\n  font-size: 1.1rem;\n  font-weight: 500;\n  cursor: pointer;\n}\nmain .currentBoard button.delete,\nmain .currentBoard input.rename {\n  position: fixed;\n  height: 2.5rem;\n  background-color: rgb(24, 26, 27);\n  border-radius: 3px;\n  border: none;\n  font-weight: 500;\n  color: rgb(199, 196, 189);\n  cursor: pointer;\n}\nmain .currentBoard button.delete:hover {\n  filter: brightness(1.3);\n}\nmain .currentBoard input.rename {\n  margin-left: 3rem;\n  margin-top: 0.05em;\n  width: calc(100vw - 9rem);\n  font-size: 1.1rem;\n  padding: 0.3em;\n  outline: none;\n}\nmain .currentBoard button.delete {\n  margin-top: 0.05em;\n  right: 0.3rem;\n  width: 4rem;\n}\nmain .currentBoard .board {\n  grid-column: 1/3;\n  grid-row: 2/3;\n  align-self: start;\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: 50vw;\n  gap: 10px;\n}\nmain .currentBoard .board .list {\n  display: grid;\n  grid-template-columns: 1rem calc(50vw - 2rem - 10px) 1rem;\n  grid-row-gap: 10px;\n  align-items: center;\n  position: relative;\n  height: fit-content;\n  padding: 5px;\n  background-color: rgb(34, 37, 38);\n  border-radius: 5px;\n}\nmain .currentBoard .board .list h2 {\n  grid-column: 2/3;\n  grid-row: 1/2;\n  margin: 0em 0.5em;\n  padding: 0.125em 0em;\n  font-size: 1rem;\n  font-weight: 500;\n  cursor: pointer;\n}\nmain .currentBoard .board .list .headingInput {\n  grid-column: 2/3;\n  grid-row: 1/2;\n  padding: 0em 0.37em;\n  background-color: rgb(24, 26, 27);\n  color: rgb(199, 196, 189);\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 500;\n  font-size: 1rem;\n  outline: none;\n  border: 2px solid rgb(35, 92, 153);\n  border-radius: 3px;\n}\nmain .currentBoard .board .list .card {\n  grid-column: 1/4;\n  display: grid;\n  grid-template-columns: 1fr auto;\n  grid-template-rows: 1fr 1fr;\n  background-color: rgb(24, 26, 27);\n  border-radius: 5px;\n}\nmain .currentBoard .board .list .card h3 {\n  grid-column: 1/2;\n  grid-row: 1/3;\n  align-self: stretch;\n  padding-left: 0.3em;\n  display: flex;\n  align-items: center;\n  font-size: 1rem;\n  font-weight: 400;\n  cursor: pointer;\n}\nmain .currentBoard .board .list .card .moveUpBtn {\n  grid-column: 2/3;\n  grid-row: 1/2;\n}\nmain .currentBoard .board .list .card .moveDownBtn {\n  grid-column: 2/3;\n  grid-row: 2/3;\n}\nmain .currentBoard .board .list .card:hover {\n  background-color: rgb(29, 32, 33);\n}\nmain .currentBoard .board .list .newCard,\nmain .currentBoard .board .list .newCardInput {\n  grid-column: 1/3;\n  order: 1;\n  height: 40px;\n  padding-left: 0.3em;\n  margin-right: 0.3em;\n  text-align: start;\n  font-size: 1rem;\n  font-weight: 400;\n  color: rgb(199, 196, 189);\n  background: none;\n  border: none;\n  border-radius: 3px;\n  outline: none;\n  cursor: pointer;\n}\nmain .currentBoard .board .list .newCardInput {\n  background-color: rgb(24, 26, 27);\n}\nmain .currentBoard .board .list .newCard:hover {\n  filter: brightness(1.3);\n}\nmain .currentBoard .board .list .kebabBtn {\n  grid-column: 3/4;\n  order: 1;\n  justify-self: center;\n  background: none;\n  border: none;\n  color: rgb(199, 196, 189);\n  cursor: pointer;\n}\nmain .currentBoard .board .list .kebabBtn svg {\n  height: 1.3rem;\n  width: 2rem;\n}\nmain .currentBoard .board .list .kebabBtn:hover {\n  filter: brightness(1.3);\n}\nmain .currentBoard .board .list .menu {\n  position: absolute;\n  right: 0.5rem;\n  bottom: -1.5rem;\n  background-color: rgb(24, 26, 27);\n}\nmain .currentBoard .board .list .menu .removeList {\n  padding: 0.5em 1em;\n  font-family: \"Roboto\", sans-serif;\n  color: rgb(199, 196, 189);\n  font-size: 1rem;\n  background: none;\n  border: none;\n  border-radius: 3px;\n  cursor: pointer;\n}\nmain .currentBoard .board .list .menu .removeList:hover {\n  filter: brightness(1.3);\n}\nmain .currentBoard .board .list .moveBackBtn,\nmain .currentBoard .board .list .moveForwardBtn,\nmain .currentBoard .board .list .moveUpBtn,\nmain .currentBoard .board .list .moveDownBtn {\n  align-self: center;\n  justify-self: center;\n  width: 20px;\n  height: 20px;\n  border: none;\n  background: none;\n  cursor: pointer;\n}\nmain .currentBoard .board .list .moveBackBtn svg,\nmain .currentBoard .board .list .moveForwardBtn svg,\nmain .currentBoard .board .list .moveUpBtn svg,\nmain .currentBoard .board .list .moveDownBtn svg {\n  width: 100%;\n  height: 100%;\n  color: rgb(199, 196, 189);\n}\nmain .currentBoard .board .list .moveBackBtn svg:hover,\nmain .currentBoard .board .list .moveForwardBtn svg:hover,\nmain .currentBoard .board .list .moveUpBtn svg:hover,\nmain .currentBoard .board .list .moveDownBtn svg:hover {\n  filter: brightness(1.5);\n}\nmain .currentBoard .board button.newList,\nmain .currentBoard .board input.newList {\n  order: 1;\n  height: 2rem;\n  padding-left: 0.5em;\n  text-align: start;\n  color: rgb(199, 196, 189);\n  font-size: 1rem;\n  font-weight: 500;\n  background: none;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\nmain .currentBoard .board input.newList {\n  background-color: rgb(26, 28, 30);\n  border-radius: 3px;\n}\nmain .currentBoard .board button.newList:hover {\n  filter: brightness(1.3);\n}\n\nfooter {\n  grid-column: 1/3;\n  grid-row: 2/3;\n  z-index: 1;\n  text-align: center;\n  padding: 0.6rem;\n  font-size: 0.6rem;\n  background-color: black;\n}\nfooter a {\n  text-decoration: none;\n  color: rgb(25, 66, 146);\n}\n\n@media (min-width: 600px) {\n  .modalWrapper .modal {\n    grid-template-columns: 330px 1.5rem;\n  }\n  main {\n    grid-template-columns: 240px auto;\n  }\n  main .currentBoard .board {\n    grid-auto-columns: 290px;\n  }\n  main .currentBoard .board .list {\n    grid-template-columns: 1rem calc(290px - 2rem - 10px) 1rem;\n  }\n}", "",{"version":3,"sources":["webpack://./src/style.scss"],"names":[],"mappings":"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","sourcesContent":["* {\n  padding: 0;\n  margin: 0;\n  box-sizing: border-box;\n}\n\n$font-stack: \"Roboto\", sans-serif;\n$font-color-primary: rgb(199, 196, 189);\n$font-color-secondary: rgb(25, 66, 146);\n\n$color-primary: rgb(26, 28, 30);\n$color-secondary: rgb(24, 26, 27);\n$color-light: rgb(34, 37, 38);\n$color-focus-dark: rgb(46, 49, 53);\n$color-focus-blue: rgb(35, 92, 153);\n\nhtml {\n  height: -webkit-fill-available;\n}\n\nbody {\n  height: 100vh;\n  min-height: 100vh;\n  min-height: -webkit-fill-available;\n\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n\n  font-family: $font-stack;\n  color: $font-color-primary;\n  background-color: $color-primary;\n}\n\nbutton,\ninput {\n  font-family: $font-stack;\n}\n\n// stuff for hiding / showing dynamic input field\n.dynamicText,\n.dynamicInput {\n  order: 1;\n}\n\n.dynamicText.active {\n  display: none;\n}\n\n.dynamicInput {\n  display: none;\n}\n.dynamicInput.active {\n  display: inline-block;\n}\n\n// custom scrollbar\n::-webkit-scrollbar {\n  height: 5px;\n}\n// handle\n::-webkit-scrollbar-thumb {\n  background: rgb(64, 64, 64);\n}\n\n.modalWrapper {\n  display: none; // hidden by default\n  position: fixed;\n  z-index: 4; // sits on top\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n\n  justify-content: center;\n  align-items: center;\n\n  .modal {\n    background-color: $color-primary;\n    padding: 2rem;\n    border-radius: 5px;\n\n    display: grid;\n    grid-template-columns: 55vw 1.5rem;\n    grid-template-rows: 3rem 1rem auto 1.3rem;\n    row-gap: 1rem;\n    align-items: center;\n\n    h2.title {\n      grid-column: 1 / 2;\n      grid-row: 1 / 2;\n\n      cursor: pointer;\n    }\n    input.title {\n      grid-column: 1 / 2;\n      grid-row: 1 / 2;\n\n      padding: 0.2em;\n\n      background-color: $color-secondary;\n      border: 2px solid $color-focus-blue;\n      border-radius: 3px;\n      outline: none;\n\n      color: $font-color-primary;\n      font-family: $font-stack;\n      font-size: 1.5rem;\n      font-weight: 600;\n\n      // to prevent the text from moving when you begin editing\n      margin-left: -0.284em;\n    }\n\n    button.close {\n      background: none;\n      border: none;\n      color: $font-color-primary;\n      cursor: pointer;\n\n      svg {\n        height: 1.5rem;\n      }\n    }\n    button.close:hover {\n      filter: brightness(1.3);\n    }\n\n    div.description {\n      font-weight: 500;\n    }\n\n    p.description.dynamicText {\n      grid-column: 1 / 3;\n      grid-row: 3 / 4;\n\n      padding: 0.69em 0;\n      padding-right: 0.5em;\n      padding-top: 0.69em;\n\n      cursor: pointer;\n    }\n    textarea.description {\n      grid-column: 1 / 3;\n      grid-row: 3 / 4;\n\n      padding: 0.5em;\n      margin-left: -0.63em;\n      position: relative;\n      top: 1px;\n      left: 0.1px;\n\n      background-color: $color-secondary;\n      border: 2px solid $color-focus-blue;\n      border-radius: 3px;\n      outline: none;\n\n      color: $font-color-primary;\n      font-family: $font-stack;\n      font-weight: 400;\n      font-size: 1rem;\n\n      resize: none; // prevent user from resizing textarea manually\n    }\n\n    .delete {\n      grid-row: 4 / 5;\n      grid-column: 2 / 3;\n\n      background: none;\n      border: none;\n      color: $font-color-primary;\n\n      svg {\n        height: 1.3rem;\n      }\n    }\n    .delete:hover {\n      filter: brightness(1.3);\n    }\n  }\n}\n\nmain {\n  flex: 1 1 auto;\n\n  width: 100%;\n  overflow-x: scroll;\n  display: grid;\n  grid-template-columns: 40vw auto;\n  grid-template-rows: 1fr auto;\n\n  $sidebarTransition: left 0.4s ease;\n  .sidebar {\n    grid-column: 1 / 2;\n    grid-row: 1 / 3;\n    z-index: 3;\n\n    position: relative;\n    left: 0;\n    transition: $sidebarTransition;\n\n    display: flex;\n    flex-direction: column;\n    gap: 0.5rem;\n    padding: 10%;\n\n    background-color: $color-primary;\n\n    .logo {\n      display: flex;\n      align-items: center;\n      gap: 0.3em;\n      padding-bottom: 0.7rem;\n\n      svg {\n        height: 1.1rem;\n      }\n\n      h1 {\n        font-size: 1rem;\n      }\n    }\n\n    button,\n    input {\n      text-align: start;\n      padding: 0.7em 0.2em;\n\n      border: none;\n      border-radius: 3px;\n      background: none;\n\n      color: $font-color-primary;\n      font-weight: 500;\n\n      cursor: pointer;\n    }\n\n    button:hover {\n      background-color: $color-focus-dark;\n    }\n\n    button.newBoard {\n      font-weight: 400;\n    }\n\n    input.newBoard {\n      position: relative;\n      right: 2px;\n      bottom: 2px;\n\n      background-color: $color-focus-dark;\n      outline: none;\n      border: 2px solid $color-focus-blue;\n    }\n  }\n  .sidebar.hidden {\n    left: -40vw;\n    transition: $sidebarTransition;\n  }\n\n  button.burger {\n    position: fixed;\n    z-index: 2;\n    margin: 15px 0 0 15px;\n\n    width: 30px;\n    height: 30px;\n\n    border: none;\n    background: none;\n    cursor: pointer;\n\n    svg {\n      height: 30px;\n      color: $font-color-primary;\n    }\n  }\n\n  .currentBoard {\n    grid-column: 1 / 3;\n    grid-row: 1 / 3;\n    z-index: 1;\n\n    display: grid;\n    grid-template-columns: auto auto;\n    grid-template-rows: 2.5rem 1fr;\n    gap: 0.8rem;\n\n    background-color: black;\n    padding: 10px;\n\n    > .dynamicText,\n    > .dynamicInput {\n      order: 0;\n    }\n\n    h1 {\n      position: fixed;\n      padding: 0.3em;\n      margin-left: 3rem;\n      margin-top: 0.3em;\n\n      font-size: 1.1rem;\n      font-weight: 500;\n\n      cursor: pointer;\n    }\n\n    button.delete,\n    input.rename {\n      position: fixed;\n      height: 2.5rem;\n\n      background-color: $color-secondary;\n      border-radius: 3px;\n      border: none;\n\n      font-weight: 500;\n      color: $font-color-primary;\n\n      cursor: pointer;\n    }\n    button.delete:hover {\n      filter: brightness(1.3);\n    }\n\n    input.rename {\n      margin-left: 3rem;\n      margin-top: 0.05em;\n      width: calc(100vw - 9rem);\n\n      font-size: 1.1rem;\n      padding: 0.3em;\n\n      outline: none;\n    }\n\n    button.delete {\n      margin-top: 0.05em;\n      right: 0.3rem;\n      width: 4rem;\n    }\n\n    .board {\n      grid-column: 1 / 3;\n      grid-row: 2 / 3;\n      align-self: start;\n\n      display: grid;\n      grid-auto-flow: column;\n      grid-auto-columns: 50vw;\n      gap: 10px;\n\n      .list {\n        display: grid;\n        grid-template-columns: 1rem calc(50vw - 2rem - 10px) 1rem;\n        grid-row-gap: 10px;\n        align-items: center;\n        position: relative;\n\n        height: fit-content;\n        padding: 5px;\n\n        background-color: $color-light;\n        border-radius: 5px;\n\n        h2 {\n          grid-column: 2 / 3;\n          grid-row: 1 / 2;\n          margin: 0em 0.5em;\n          padding: 0.125em 0em;\n\n          font-size: 1rem;\n          font-weight: 500;\n          cursor: pointer;\n        }\n        .headingInput {\n          grid-column: 2 / 3;\n          grid-row: 1 / 2;\n          padding: 0em 0.37em;\n\n          background-color: $color-secondary;\n          color: $font-color-primary;\n          font-family: $font-stack;\n          font-weight: 500;\n          font-size: 1rem;\n\n          outline: none;\n          border: 2px solid $color-focus-blue;\n          border-radius: 3px;\n        }\n\n        .card {\n          grid-column: 1 / 4;\n\n          display: grid;\n          grid-template-columns: 1fr auto;\n          grid-template-rows: 1fr 1fr;\n\n          background-color: $color-secondary;\n          border-radius: 5px;\n\n          h3 {\n            grid-column: 1 / 2;\n            grid-row: 1 / 3;\n            align-self: stretch;\n            padding-left: 0.3em;\n\n            display: flex;\n            align-items: center;\n\n            font-size: 1rem;\n            font-weight: 400;\n            cursor: pointer;\n          }\n          .moveUpBtn {\n            grid-column: 2 / 3;\n            grid-row: 1 / 2;\n          }\n          .moveDownBtn {\n            grid-column: 2 / 3;\n            grid-row: 2 / 3;\n          }\n        }\n        .card:hover {\n          background-color: rgb(29, 32, 33);\n        }\n\n        .newCard,\n        .newCardInput {\n          grid-column: 1 / 3;\n          order: 1;\n          height: 40px;\n          padding-left: 0.3em;\n          margin-right: 0.3em;\n\n          text-align: start;\n          font-size: 1rem;\n          font-weight: 400;\n          color: $font-color-primary;\n\n          background: none;\n          border: none;\n          border-radius: 3px;\n          outline: none;\n\n          cursor: pointer;\n        }\n        .newCardInput {\n          background-color: $color-secondary;\n        }\n        .newCard:hover {\n          filter: brightness(1.3);\n        }\n\n        .kebabBtn {\n          grid-column: 3 / 4;\n          order: 1;\n          justify-self: center;\n\n          background: none;\n          border: none;\n          color: $font-color-primary;\n          cursor: pointer;\n\n          svg {\n            height: 1.3rem;\n            width: 2rem;\n          }\n        }\n        .kebabBtn:hover {\n          filter: brightness(1.3);\n        }\n\n        .menu {\n          position: absolute;\n          right: 0.5rem;\n          bottom: -1.5rem;\n\n          background-color: $color-secondary;\n\n          .removeList {\n            padding: 0.5em 1em;\n\n            font-family: $font-stack;\n            color: $font-color-primary;\n            font-size: 1rem;\n            background: none;\n\n            border: none;\n            border-radius: 3px;\n            cursor: pointer;\n          }\n          .removeList:hover {\n            filter: brightness(1.3);\n          }\n        }\n\n        .moveBackBtn,\n        .moveForwardBtn,\n        .moveUpBtn,\n        .moveDownBtn {\n          align-self: center;\n          justify-self: center;\n          width: 20px;\n          height: 20px;\n\n          //border: 1px solid red;\n          border: none;\n          background: none;\n\n          cursor: pointer;\n\n          svg {\n            width: 100%;\n            height: 100%;\n\n            color: $font-color-primary;\n          }\n          svg:hover {\n            filter: brightness(1.5);\n          }\n        }\n      }\n\n      button.newList,\n      input.newList {\n        order: 1; // the button should always be last\n\n        height: 2rem;\n        padding-left: 0.5em;\n\n        text-align: start;\n        color: $font-color-primary;\n        font-size: 1rem;\n        font-weight: 500;\n\n        background: none;\n        border: none;\n        outline: none;\n        cursor: pointer;\n      }\n      input.newList {\n        background-color: $color-primary;\n        border-radius: 3px;\n      }\n      button.newList:hover {\n        filter: brightness(1.3);\n      }\n    }\n  }\n}\n\nfooter {\n  grid-column: 1 / 3;\n  grid-row: 2 / 3;\n  z-index: 1;\n\n  text-align: center;\n  padding: 0.6rem;\n  font-size: 0.6rem;\n  background-color: black;\n\n  a {\n    text-decoration: none;\n    color: $font-color-secondary;\n  }\n}\n\n@media (min-width: 600px) {\n  .modalWrapper {\n    .modal {\n      grid-template-columns: 330px 1.5rem;\n    }\n  }\n\n  main {\n    grid-template-columns: 240px auto;\n\n    .currentBoard {\n      .board {\n        grid-auto-columns: 290px;\n\n        .list {\n          grid-template-columns: 1rem calc(290px - 2rem - 10px) 1rem;\n        }\n      }\n    }\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/dist/cjs.js!./style.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.ts"));
/******/ }
]);
//# sourceMappingURL=main.bundle.js.map