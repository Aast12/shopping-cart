import { useState } from 'react';

type EventState = {
    gotError: boolean;
    gotSuccess: boolean;
    isLoading: boolean;
    successMessage: string;
    errorMessage: string;
};

const useEventModalState = ({
    initialState,
}: {
    initialState?: EventState;
}) => {
    const [eventState, setEventState] = useState<EventState>(
        initialState ?? {
            gotError: false,
            gotSuccess: false,
            isLoading: false,
            successMessage: 'Success!',
            errorMessage: 'An error occured',
        }
    );

    const trigger = () => {
        setEventState({ ...eventState, isLoading: true });
    };

    const setError = (errorMessage: string = 'An error occured') => {
        setEventState({
            ...eventState,
            isLoading: false,
            gotError: true,
            errorMessage,
        });
    };

    const setSuccess = (successMessage: string = 'Success!') => {
        setEventState({
            ...eventState,
            isLoading: false,
            gotSuccess: true,
            successMessage,
        });
    };

    const reset = () => {
        setEventState(
            initialState ?? {
                gotError: false,
                gotSuccess: false,
                isLoading: false,
                successMessage: 'Success!',
                errorMessage: 'An error occured',
            }
        );
    };

    const triggerReset = () => {
        setEventState({
            ...(initialState ?? {
                gotError: false,
                gotSuccess: false,

                successMessage: 'Success!',
                errorMessage: 'An error occured',
            }),
            isLoading: true,
        });
    };

    return { eventState, setError, setSuccess, trigger, reset };
};

export default useEventModalState;
