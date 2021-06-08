import { EditIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Center,
    Container,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    FormLabelProps,
    Heading,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useBoolean,
    useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    FileUpload,
    ValidatedInput,
    ValidatedInputProps,
} from '../components/FormComponents';
import useAuth from '../hooks/useAuth';
import { setUser } from '../redux/slices/user';
import { RootState } from '../redux/store';
import { User } from '../types/Users';
import { objToFormData, toBase64 } from '../utils';

type UserPayload = Omit<
    User,
    'profilePicture' | 'createdAt' | 'updatedAt' | '_id' | 'orders' | 'role'
> & { profilePicture?: FileList };

const castInputProps = (values: ValidatedInputProps<UserPayload>) => values;

const Profile = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [editing, setEditing] = useBoolean(false);
    const methods = useForm<UserPayload>();
    const { register, watch, control } = methods;
    const [profilePictureValue] = watch(['profilePicture']);
    const [profilePicSrc, setProfilePicSrc] =
        useState<string | ArrayBuffer | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { deleteProfile } = useAuth();

    const onSubmit = (values: UserPayload) => {
        if (user) {
            const { profilePicture, ...tmp } = values;
            const payload: Omit<UserPayload, 'profilePicture'> & {
                profilePicture?: File;
            } = tmp;

            if (profilePicture && profilePicture.length > 0) {
                payload.profilePicture = profilePicture[0];
            }

            axios
                .put(`/users/${user?._id}`, objToFormData(payload))
                .then(async () => {
                    const { profilePicture, ...usedValues } = values;
                    let newUserData = { ...user, ...usedValues };
                    if (profilePicture && profilePicture.length > 0) {
                        const b64Picture = await toBase64(profilePicture[0]);
                        if (typeof b64Picture === 'string') {
                            newUserData.profilePicture = b64Picture;
                        }
                    }

                    dispatch(setUser(newUserData));
                    setEditing.off();
                })
                .catch(console.error);
        }
    };

    useEffect(() => {
        const { setValue } = methods;
        if (user && !editing) {
            user?.dateOfBirth &&
                setValue(
                    'dateOfBirth',
                    moment(user.dateOfBirth).toISOString().substr(0, 10)
                );
            setValue('givenName', user.givenName);
            setValue('lastName', user.lastName);
            setValue('email', user.email);
            if (user?.profilePicture) {
                if (typeof user?.profilePicture === 'string') {
                    setProfilePicSrc(user?.profilePicture);
                } else {
                    user?.profilePicture?.data &&
                        setProfilePicSrc(
                            `data:${user.profilePicture.contentType};base64,${user.profilePicture.data}`
                        );
                }
            }
        }
    }, [editing, user, methods]);

    useEffect(() => {
        if (profilePictureValue && profilePictureValue.length > 0) {
            const file = profilePictureValue[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function (e) {
                setProfilePicSrc(reader.result);
            };
        }
    }, [profilePictureValue]);

    const labelProps: FormLabelProps = {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 'xs',
    };

    if (!user) return <Text>You are not logged in</Text>;

    return (
        <Container maxW="container.md" py={8}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Heading>Profile</Heading>
                        <ButtonGroup variant="ghost">
                            <Button
                                colorScheme={editing ? 'red' : 'blue'}
                                onClick={setEditing.toggle}
                            >
                                {editing ? 'Cancel' : 'Edit'}
                            </Button>
                            {editing && (
                                <Button colorScheme={'blue'} type="submit">
                                    Save
                                </Button>
                            )}
                        </ButtonGroup>
                    </Flex>
                    <Divider my={2} />
                    <Stack py={4} spacing={8}>
                        <Center mb={4}>
                            <Box pos="relative" w="fit-content">
                                <Avatar
                                    size="2xl"
                                    src={
                                        typeof profilePicSrc === 'string'
                                            ? profilePicSrc
                                            : ''
                                    }
                                    name={`${user.givenName} ${user.lastName}`}
                                    userSelect="none"
                                    borderColor="black"
                                />
                                <FileUpload
                                    accept="image/*"
                                    register={register('profilePicture')}
                                >
                                    <IconButton
                                        display={editing ? 'block' : 'none'}
                                        pos="absolute"
                                        bottom={0}
                                        right={0}
                                        colorScheme="blackAlpha"
                                        bgColor="black"
                                        aria-label="edit"
                                        rounded="full"
                                        icon={<EditIcon />}
                                    />
                                </FileUpload>
                            </Box>
                        </Center>
                        <Stack direction={['column', 'row']}>
                            <ValidatedInput
                                isDisabled={!editing}
                                variant="flushed"
                                placeholder="Given Name"
                                label="Given Name"
                                labelProps={labelProps}
                                {...castInputProps({
                                    field: 'givenName',
                                    registerOptions: {
                                        required: 'This field can not be empty',
                                    },
                                })}
                            />
                            <ValidatedInput
                                isDisabled={!editing}
                                variant="flushed"
                                placeholder="Last Name"
                                label="Last Name"
                                labelProps={labelProps}
                                {...castInputProps({
                                    field: 'lastName',
                                    registerOptions: {
                                        required: 'This field can not be empty',
                                    },
                                })}
                            />
                        </Stack>
                        <ValidatedInput
                            isDisabled={!editing}
                            variant="flushed"
                            placeholder="Email"
                            type="email"
                            label="Email"
                            labelProps={labelProps}
                            {...castInputProps({
                                field: 'email',
                                registerOptions: {
                                    required: 'This field can not be empty',
                                },
                            })}
                        />
                        <Controller
                            control={control}
                            name="dateOfBirth"
                            render={(props) => (
                                <FormControl
                                    isRequired
                                    isInvalid={
                                        props.fieldState.error ? true : false
                                    }
                                >
                                    <FormLabel {...labelProps}>
                                        Date of Birth
                                    </FormLabel>

                                    <Input
                                        isDisabled={!editing}
                                        variant="flushed"
                                        type="date"
                                        placeholderText="Date of birth"
                                        onChange={(e) => {
                                            props.field.onChange(
                                                e.target.value
                                            );
                                        }}
                                        value={props.field.value ?? ''}
                                    />
                                    <FormErrorMessage>
                                        {props.fieldState.error &&
                                            props.fieldState.error.message}
                                    </FormErrorMessage>
                                </FormControl>
                            )}
                        />
                    </Stack>
                </form>
            </FormProvider>
            <Button colorScheme="red" onClick={onOpen}>
                Delete Profile
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior="inside"
                isCentered
                closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center"></ModalHeader>
                    <ModalBody>
                        <Text>
                            Are you sure you want to delete your account?
                        </Text>
                    </ModalBody>

                    <ModalFooter justifyContent="center">
                        <ButtonGroup>
                            <Button
                                variant="ghost"
                                onClick={deleteProfile}
                                colorScheme="red"
                            >
                                Yes, delete it
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                colorScheme="blue"
                            >
                                No, I changed my mind
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Profile;
