import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Card from '../components/Card';
import { ValidatedInput } from '../components/FormComponents';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import { setUser } from '../redux/slices/user';
import { User } from '../types/Users';

type SignUpData = Omit<User, 'profilePicture' | '_id' | 'orders'> & {
    password: string;
    passwordConfirmation: string;
};

const SignUpModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const methods = useForm<SignUpData>();

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods;

    const onSubmit = (values: SignUpData) => {
        axios
            .post('/users/create', values)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sign Up</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack align="start" spacing={3}>
                                <Stack w="100%" direction={['column', 'row']}>
                                    <ValidatedInput
                                        placeholder="Given Name"
                                        field={'givenName'}
                                        registerOptions={{
                                            required: 'This is required',
                                        }}
                                    />
                                    <ValidatedInput
                                        placeholder="Last Name"
                                        field={'lastName'}
                                        registerOptions={{
                                            required: 'This is required',
                                        }}
                                    />
                                </Stack>
                                <ValidatedInput
                                    placeholder="Email"
                                    type="email"
                                    field={'email'}
                                    registerOptions={{
                                        required: 'This is required',
                                    }}
                                />
                                <ValidatedInput
                                    placeholder="Password"
                                    type="password"
                                    field={'password'}
                                    registerOptions={{
                                        required: 'This is required',
                                        minLength: {
                                            value: 6,
                                            message:
                                                'Minimum length should be 6',
                                        },
                                    }}
                                />
                                <ValidatedInput
                                    placeholder="Confirm Password"
                                    type="password"
                                    field={'passwordConfirmation'}
                                    registerOptions={{
                                        required: 'This is required',
                                        validate: (val) =>
                                            val === watch('password'),
                                    }}
                                    customError={
                                        errors.passwordConfirmation &&
                                        errors.passwordConfirmation.type ===
                                            'validate' && (
                                            <span>Passwords must match</span>
                                        )
                                    }
                                />

                                <Button w="100%" type="submit">
                                    Sign Up
                                </Button>
                            </VStack>
                        </form>
                    </FormProvider>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const Landing = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    // const dispatch = useDispatch();
    const { loginUser, error } = useAuth();
    const { user } = useUser();
    const methods = useForm<Pick<User, 'email'> & { password: string }>();

    const onSubmit = (values: Pick<User, 'email'> & { password: string }) => {
        loginUser(values);
    };

    if (user) return <Redirect to="/" />;

    return (
        <Box>
            <Flex
                direction={['column', 'row']}
                sx={{ '& > *': { mx: '2', flex: 1 } }}
                h="100vh"
            >
                <Center>
                    <Heading>Shopping Cart</Heading>
                </Center>
                <Center>
                    <Card w="md">
                        <Heading mb={4}>Log In</Heading>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <VStack align="start" spacing={3}>
                                    <ValidatedInput
                                        placeholder="Email"
                                        type="email"
                                        field={'email'}
                                        registerOptions={{
                                            required: 'This is required',
                                        }}
                                    />
                                    <ValidatedInput
                                        placeholder="Password"
                                        type="password"
                                        field={'password'}
                                        registerOptions={{
                                            required: 'This is required',
                                        }}
                                    />
                                    <Button w="100%" type="submit">
                                        Log In
                                    </Button>
                                </VStack>
                            </form>
                        </FormProvider>
                        <Flex
                            direction={['column', 'row']}
                            justifyContent="space-between"
                            w="100%"
                            my={2}
                        >
                            <Link color="blue.300" mt={0} fontSize="sm">
                                Forgot password?
                            </Link>
                            <Text fontSize="sm">
                                Not registered yet?{' '}
                                <Link color="blue.300" onClick={onOpen}>
                                    Sign Up
                                </Link>
                            </Text>
                        </Flex>
                        <SignUpModal isOpen={isOpen} onClose={onClose} />
                    </Card>
                </Center>
            </Flex>
        </Box>
    );
};

export default Landing;
