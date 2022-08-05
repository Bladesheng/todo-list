import "./style.scss";

// initialize storage before UI
import Storage from "./modules/Storage";
Storage.getLocalStorage();

import UI from "./modules/UI";

UI.init();
