import {
  clearLocalStorageValue,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../helpers";

export const saveState = <T>(key: string, value: T) => {
  saveToLocalStorage({ key, value });
};

export const loadState = (value: string) => {
  return loadFromLocalStorage(value);
};

export const clearState = (value: string) => {
  return clearLocalStorageValue(value);
};
