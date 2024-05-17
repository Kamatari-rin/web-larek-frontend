import { MarketAPI } from './components/Services/MarketAPI';
import { UserAPI } from './components/Services/UserAPI';
import { Presenter } from './components/Services/Presenter';
import './scss/styles.scss';
import { settings } from './utils/constants';
import { ensureElement } from './utils/utils';

const marketAPI = new MarketAPI(settings.API_URL);
const userAPI = new UserAPI(settings.API_URL)
const contentElement = ensureElement<HTMLElement>('.page');

const presenter = new Presenter(contentElement, marketAPI, userAPI);
presenter.init();