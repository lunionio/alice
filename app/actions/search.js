import numsdk from 'num';
import development from '../config'; // TODO configurar dynamic config

const num = new numsdk(development);

// TODO Instalar a lib do NUM
export const search = querie => num.search(querie);

export const create = doc => num.create(doc);

export const detail = doc => num.detail(collection);
