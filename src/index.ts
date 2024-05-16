import { MarketAPI, UserAPI } from './components/base/api';
import { Presenter } from './components/base/Presenter';
import './scss/styles.scss';
import { settings, templates } from './utils/constants';
import { ensureElement } from './utils/utils';

// https://larek-api.nomoreparties.co/content/weblarek/5_Dots.svg

const marketAPI = new MarketAPI(settings.url);
const userAPI = new UserAPI(settings.url)
const contentElement = ensureElement<HTMLElement>('.page');

const presenter = new Presenter(contentElement, marketAPI, userAPI);
presenter.init();