import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import cartReducer from './slices/cart';

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
