import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addProduct,
    deleteProduct,
    toggleProduct,
    empty,
} from '../redux/slices/cart';
import { RootState } from '../redux/store';

const useShoppingCart = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const { products } = useSelector((state: RootState) => state.cart);

    const toggle = (id: string) => {
        toast({
            description: 'Your shopping cart was modified',
            status: 'info',
            duration: 1000,
            position: 'bottom-right',
        });
        dispatch(toggleProduct({ id }));
    };

    const add = (id: string, quantity: number) => {
        toast({
            description: 'The product has been added to your cart',
            status: 'info',
            duration: 1000,
            position: 'bottom-right',
        });
        dispatch(addProduct({ id, quantity }));
    };

    const del = (id: string) => {
        dispatch(deleteProduct({ id }));
    };

    const drop = () => {
        dispatch(empty({}));
    };

    const contains = useCallback(
        (id: string) => {
            const item = products.find((product) => product.id === id);

            return item ? true : false;
        },
        [products]
    );

    const getById = useCallback(
        (id: string) => {
            const item = products.find((product) => product.id === id);

            return item;
        },
        [products]
    );

    return { toggle, add, del, drop, contains, getById, products };
};

export default useShoppingCart;
