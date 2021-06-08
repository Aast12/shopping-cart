import { useState } from 'react';

type CheckoutState = {
    gotError: boolean;
    gotSuccess: boolean;
    isLoading: boolean;
    successMessage: string;
    errorMessage: string;
};

const useEventModalState = ({
    initialState,
}: {
    initialState?: CheckoutState;
}) => {
    const [checkoutState, setCheckoutState] = useState<CheckoutState>(
        initialState ?? {
            gotError: false,
            gotSuccess: false,
            isLoading: false,
            successMessage: 'Success!',
            errorMessage: 'An error occured',
        }
    );

    const trigger = () => {
        setCheckoutState({ ...checkoutState, isLoading: true });
    };

    const setError = (errorMessage: string = 'An error occured') => {
        setCheckoutState({
            ...checkoutState,
            isLoading: false,
            gotError: true,
            errorMessage,
        });
    };

    const setSuccess = (successMessage: string = 'Success!') => {
        setCheckoutState({
            ...checkoutState,
            isLoading: false,
            gotSuccess: true,
            successMessage,
        });
    };

    return { checkoutState, setError, setSuccess, trigger };
};

export default useEventModalState;
