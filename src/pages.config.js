import Game from './pages/Game';
import UpgradeShop from './pages/UpgradeShop';
import AbilityShop from './pages/AbilityShop';
import Home from './pages/Home';
import LevelSelect from './pages/LevelSelect';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Game": Game,
    "UpgradeShop": UpgradeShop,
    "AbilityShop": AbilityShop,
    "Home": Home,
    "LevelSelect": LevelSelect,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};