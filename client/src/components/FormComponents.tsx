import {
    FormControl,
    FormErrorMessage,
    Input,
    InputProps,
} from '@chakra-ui/react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

type ValidatedInputProps<T> = {
    registerOptions: RegisterOptions;
    field: keyof T;
    customError?: React.ReactNode;
} & InputProps;

export const ValidatedInput = <T,>({
    registerOptions,
    field,
    customError,
    ...props
}: ValidatedInputProps<T>) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<T>();
    return (
        <FormControl isRequired isInvalid={errors[field] ? true : false}>
            <Input
                {...props}
                // @ts-ignore
                {...register(field, registerOptions)}
            />
            <FormErrorMessage>
                {/* @ts-ignore */}
                {errors[field] && errors[field]?.message}
                {customError}
            </FormErrorMessage>
        </FormControl>
    );
};
