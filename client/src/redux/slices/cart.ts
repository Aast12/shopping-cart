import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ShoppingCart } from '../../types/ShoppingCart';

const initialState: ShoppingCart = { products: [] };

const shoppingCartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleProduct(state, action: PayloadAction<{ id: string }>) {
            const queryIdx = state.products?.findIndex(
                (product) => product.id === action.payload.id
            );

            if (queryIdx && queryIdx !== -1) {
                state.products?.splice(queryIdx, 1);
            } else {
                state.products?.push({ id: action.payload.id, quantity: 1 });
            }
        },
        addProduct(
            state,
            action: PayloadAction<{ id: string; quantity: number }>
        ) {
            const queryIdx = state.products?.findIndex(
                (product) => product.id === action.payload.id
            );

            if (queryIdx && queryIdx !== -1) {
                state.products?.push(action.payload);
            } else if (queryIdx) {
                state.products[queryIdx] = action.payload;
            }
        },
        deleteProduct(state, action: PayloadAction<{ id: string }>) {
            const queryIdx = state.products?.findIndex(
                (product) => product.id === action.payload.id
            );

            if (queryIdx && queryIdx !== -1) {
                state.products?.splice(queryIdx, 1);
            }
        },
        empty(state, _) {
            state.products = [];
        },
    },
});

export const { toggleProduct, addProduct, deleteProduct, empty } =
    shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
