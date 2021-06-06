import {
    FormControl,
    FormErrorMessage,
    Input,
    InputGroup,
    InputProps,
} from '@chakra-ui/react';
import { ReactNode, useRef } from 'react';
import {
    RegisterOptions,
    useFormContext,
    UseFormRegisterReturn,
} from 'react-hook-form';

export type ValidatedInputProps<T> = {
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

type FileUploadProps = {
    register: UseFormRegisterReturn;
    accept?: string;
    multiple?: boolean;
    children?: ReactNode;
};

export const FileUpload = (props: FileUploadProps) => {
    const { register, accept, multiple, children } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { ref, ...rest } = register as {
        ref: (instance: HTMLInputElement | null) => void;
    };

    const handleClick = () => inputRef.current?.click();

    return (
        <InputGroup onClick={handleClick}>
            <input
                type={'file'}
                multiple={multiple || false}
                hidden
                accept={accept ?? ''}
                {...rest}
                ref={(e) => {
                    ref(e);
                    inputRef.current = e;
                }}
            />
            <>{children}</>
        </InputGroup>
    );
};
