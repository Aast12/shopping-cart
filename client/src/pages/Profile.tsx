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
    Heading,
    IconButton,
    Input,
    Stack,
    Text,
    useBoolean,
} from '@chakra-ui/react';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
    FileUpload,
    ValidatedInput,
    ValidatedInputProps,
} from '../components/FormComponents';
import { RootState } from '../redux/store';
import { User } from '../types/Users';
import { objToFormData } from '../utils';

type UserPayload = Omit<
    User,
    'profilePicture' | 'createdAt' | 'updatedAt' | '_id' | 'orders' | 'role'
> & { profilePicture?: FileList };

const castInputProps = (values: ValidatedInputProps<UserPayload>) => values;

const Profile = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const [editing, setEditing] = useBoolean(false);
    const methods = useForm<UserPayload>();
    const { register, watch, control } = methods;
    const [profilePictureValue] = watch(['profilePicture']);
    const [profilePicSrc, setProfilePicSrc] =
        useState<string | ArrayBuffer | null>(null);

    const onSubmit = (values: UserPayload) => {
        console.log(values);
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
                .then(console.log)
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
            user?.profilePicture?.data &&
                setProfilePicSrc(
                    `data:${user.profilePicture.contentType};base64,${user.profilePicture.data}`
                );
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
                    <Stack py={4}>
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
                                <Input
                                    variant="flushed"
                                    type="date"
                                    placeholderText="Date of birth"
                                    onChange={(e) => {
                                        props.field.onChange(e.target.value);
                                    }}
                                    value={props.field.value ?? ''}
                                />
                            )}
                        />
                    </Stack>
                </form>
            </FormProvider>
        </Container>
    );
};

export default Profile;
