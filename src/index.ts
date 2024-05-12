import { MarketAPI } from './components/base/api';
import { CardView } from './components/base/CardView';
import { Presenter } from './components/base/Presenter';
import { Product, ProductList } from './components/base/Product';
import { ListView } from './components/base/ui';
import './scss/styles.scss';
import { IProduct, IProductDefault } from './types';
import { templates } from './utils/constants';
import { ensureElement } from './utils/utils';

// https://larek-api.nomoreparties.co/content/weblarek/5_Dots.svg

const api = new MarketAPI('https://larek-api.nomoreparties.co/api/weblarek');
const contentElement = ensureElement<HTMLElement>('.page');

const presenter = new Presenter(contentElement, api);
presenter.init();