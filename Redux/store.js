import CartSlice, {add, decrement, increment, remove} from './CartSlice';
import {
  configureStore,
  createSerializableStateInvariantMiddleware,
} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, legacy_createStore as createStore} from 'redux';
import FavSlice from './FavSlice';
import MyOrdersSlice from './Data';
import Data from './Data';

let persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

let rootReducer = combineReducers({
  Data: Data,
  Balance: CartSlice,
});

let persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export {store, persistor};
