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
import { useForm } from 'react-hook-form';
import Card from '../components/Card';
import { User } from '../types/Users';

const SignUpModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { handleSubmit, register, setValue, watch } =
        useForm<
            Omit<User, 'profilePicture' | '_id' | 'orders'> & {
                passwordConfirmation: string;
            }
        >();

    const onSubmit = (
        values: Omit<User, 'profilePicture' | '_id' | 'orders'> & {
            passwordConfirmation: string;
        }
    ) => {
        console.log(values);
    };

    return (
        <Modal
            // finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sign Up</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack align="start" spacing={3}>
                            <Stack w="100%" direction={['column', 'row']}>
                                <Input
                                    placeholder="Given Name"
                                    {...register('givenName', {
                                        required: 'This is required',
                                        minLength: {
                                            value: 4,
                                            message:
                                                'Minimum length should be 4',
                                        },
                                    })}
                                />
                                <Input
                                    placeholder="Last Name"
                                    {...register('lastName', {
                                        required: 'This is required',
                                        minLength: {
                                            value: 4,
                                            message:
                                                'Minimum length should be 4',
                                        },
                                    })}
                                />
                            </Stack>
                            <Input
                                placeholder="Email"
                                {...register('email', {
                                    required: 'This is required',
                                    minLength: {
                                        value: 4,
                                        message: 'Minimum length should be 4',
                                    },
                                })}
                            />
                            <Input
                                placeholder="Password"
                                {...register('password', {
                                    required: 'This is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Minimum length should be 8',
                                    },
                                })}
                                type="password"
                            />
                            <Input
                                placeholder="Confirm Password"
                                {...register('passwordConfirmation', {
                                    required: 'This is required',
                                    validate: (val) =>
                                        val === watch('password'),
                                })}
                                type="password"
                            />
                            <Button w="100%" type="submit">
                                Sign Up
                            </Button>
                        </VStack>
                    </form>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const Landing = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { handleSubmit, register, setValue } = useForm<User>();

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
                    <Card minW="md">
                        <VStack align="start" spacing={3}>
                            <Heading>Log In</Heading>
                            <Input placeholder="email" />
                            <Input placeholder="password" type="password" />
                            <Button w="100%">Log In</Button>
                            <Flex
                                direction={['column', 'row']}
                                justifyContent="space-between"
                                w="100%"
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
                        </VStack>
                        <SignUpModal isOpen={isOpen} onClose={onClose} />
                    </Card>
                </Center>
            </Flex>
        </Box>
    );
};

export default Landing;
