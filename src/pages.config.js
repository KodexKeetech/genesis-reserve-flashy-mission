import AbilityShop from './pages/AbilityShop';
import Game from './pages/Game';
import Home from './pages/Home';
import LevelSelect from './pages/LevelSelect';
import UpgradeShop from './pages/UpgradeShop';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AbilityShop": AbilityShop,
    "Game": Game,
    "Home": Home,
    "LevelSelect": LevelSelect,
    "UpgradeShop": UpgradeShop,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};