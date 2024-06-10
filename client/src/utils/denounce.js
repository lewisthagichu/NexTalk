import { debounce } from 'lodash';

export const createDebouncedFunction = (fn, delay) => debounce(fn, delay);
