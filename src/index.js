import "./style.scss";
import board from "./modules/board";
import list from "./modules/list";
import card from "./modules/card";


let choresBoard = new board("Chores");
let dailyList = new list("Daily stuff");
let feedcatCard = new card("Feed cat", "some description", 2);
let cookfoodCard = new card("Cook food", "stuff to buy", 1);


choresBoard.addList(dailyList)
dailyList.addCard(feedcatCard);
dailyList.addCard(cookfoodCard);
