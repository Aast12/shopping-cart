import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './slices/user';
import cartReducer from './slices/cart';

const reducers = combineReducers({
    user: userReducer,
    cart: cartReducer,
});

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage,
        blacklist: ['user'],
    },
    reducers
);

const store = configureStore({
    reducer: persistedReducer,
});

const persistor = persistStore(store);

export default { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
