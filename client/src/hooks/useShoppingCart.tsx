import { useDispatch } from 'react-redux';
import {
    addProduct,
    deleteProduct,
    toggleProduct,
    empty,
} from '../redux/slices/cart';

const useShoppingCart = () => {
    const dispatch = useDispatch();

    const toggle = (id: string) => {
        dispatch(toggleProduct({ id }));
    };

    const add = (id: string, quantity: number) => {
        dispatch(addProduct({ id, quantity }));
    };

    const del = (id: string) => {
        dispatch(deleteProduct({ id }));
    };

    const drop = () => {
        dispatch(empty({}));
    };

    return { toggle, add, del, drop };
};

export default useShoppingCart;
