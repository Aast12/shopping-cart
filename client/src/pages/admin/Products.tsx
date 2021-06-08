import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Input,
    Text,
    InputGroup,
    InputLeftElement,
    Heading,
    VStack,
    useBreakpointValue,
    Select,
    ButtonGroup,
    Image,
    Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Product } from '../../types/Product';
import { FormProvider, useForm } from 'react-hook-form';
import useProducts, { ProductPostPayload } from '../../hooks/useProducts';
import {
    FileUpload,
    ValidatedInput,
    ValidatedInputProps,
} from '../../components/FormComponents';
import useEventModalState from '../../hooks/useEventModalState';
import EventModal from '../../components/EventModal';
import Card from '../../components/Card';
import { formatter } from '../../utils';
// import { toBase64 } from '../../utils';

const castInputProps = (
    values: ValidatedInputProps<Product & { image: FileList }>
) => values;

const Products = () => {
    const { products, del, edit, create } = useProducts();
    const [filter, setFilter] = useState('');

    const [selected, setSelected] = useState<Product | undefined>();
    const [adding, setAdding] = useState<boolean>(false);
    const methods = useForm<Product & { image: FileList }>();
    const { handleSubmit, register, setValue, watch } = methods;
    const [imageValue] = watch(['image']);
    const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
    const { eventState, reset, setSuccess, setError, trigger } =
        useEventModalState({});

    console.log('lol', products);

    const isCompact = useBreakpointValue({ base: true, md: false });

    const onSubmit = ({
        description,
        image,
        ...values
    }: Product & { image: FileList }) => {
        let payload = {
            ...values,
            description: description ?? '',
        } as ProductPostPayload;

        if (image && image.length > 0) payload.image = image[0];

        if (adding) {
            trigger();
            create(payload)
                .then((res) => {
                    console.log(res);
                    setSuccess('The product was created succesfully');
                })
                .catch((err) => {
                    console.log(err);
                    const msg =
                        err.respose?.data?.message ?? 'An error ocurred';
                    setError(msg);
                });
        } else if (selected?._id) {
            trigger();
            edit({
                ...payload,
                _id: selected._id,
            })
                .then((res) => {
                    console.log('???', res);
                    setSuccess('The product was updated succesfully');
                })
                .catch((err) => {
                    console.log('!!!', err);
                    const msg =
                        err.respose?.data?.message ?? 'An error ocurred';
                    setError(msg);
                });
        }
    };

    const deleteProduct = () => {
        trigger();
        selected?._id &&
            del(selected._id)
                .then((res) => {
                    console.log(res);
                    setSuccess('The product was deleted succesfully');
                })
                .catch((err) => {
                    console.log(err);
                    const msg =
                        err.respose?.data?.message ?? 'An error ocurred';
                    setError(msg);
                })
                .finally(() => {
                    setSelected(undefined);
                });
    };

    useEffect(() => {
        if (selected?.image) {
            // const b64Picture = await toBase64(profilePicture[0]);
            // if (typeof b64Picture === 'string') {
            //     newUserData.profilePicture = b64Picture;
            // }
            setImageSrc(
                `data:${selected.image.contentType};base64,${selected.image.data}`
            );
        } else {
            setImageSrc(null);
        }
    }, [selected]);

    useEffect(() => {
        if (adding) {
            setImageSrc(null);
        }
    }, [adding]);

    useEffect(() => {
        if (imageValue && imageValue.length > 0) {
            const file = imageValue[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function (e) {
                setImageSrc(reader.result);
            };
        }
    }, [imageValue]);

    const setValues = (values: Product) => {
        setValue('name', values.name);
        setValue('brand', values.brand ?? '');
        setValue('price', values.price);
        setValue('description', values.description);
        setValue('stock', values.stock ?? 0);
    };

    const selectProduct = (product: Product | undefined) => {
        if (product) {
            setSelected(product);
            setAdding(false);
            setValues(product);
        }
    };

    return (
        <Container maxW="container.lg" py={8}>
            <Heading lineHeight="tall">Products</Heading>
            <hr />
            <Stack my={2} direction={isCompact ? 'column' : 'row'} flex="1">
                <VStack as="aside" w={isCompact ? '100%' : 'xs'} px={2} pb={2}>
                    {isCompact && (
                        <Select
                            bgColor="white"
                            w="100%"
                            onChange={(e) =>
                                selectProduct(
                                    products.find(
                                        (p) => p._id === e.target.value
                                    )
                                )
                            }
                        >
                            <option selected={!selected}>
                                Select a product
                            </option>
                            {products
                                .filter((p) =>
                                    p.name.toLowerCase().includes(filter)
                                )
                                .map((p) => (
                                    <option
                                        selected={selected?._id === p._id}
                                        value={p._id ?? ''}
                                    >
                                        {p.name}
                                    </option>
                                ))}
                        </Select>
                    )}
                    <Button
                        w="100%"
                        py={3}
                        leftIcon={<AiOutlinePlus />}
                        onClick={() => {
                            selectProduct({} as Product);
                            setAdding(true);
                        }}
                    >
                        Add Product
                    </Button>
                    {!isCompact && (
                        <Box w="100%">
                            <InputGroup w="100%" mb={2}>
                                <InputLeftElement children={<SearchIcon />} />
                                <Input
                                    onChange={(e) =>
                                        setFilter(e.target.value.toLowerCase())
                                    }
                                    variant="filled"
                                    rounded="full"
                                    type="text"
                                    placeholder="Search"
                                />
                            </InputGroup>
                            <Box w="100%" flex="1" maxH="50vh" overflowY="auto">
                                {products.length === 0 ? (
                                    <Text w="100%" textAlign="center">
                                        There are no products
                                    </Text>
                                ) : (
                                    <VStack w="100" overflowY="scroll">
                                        {products
                                            .filter((p) =>
                                                p.name
                                                    .toLowerCase()
                                                    .includes(filter)
                                            )
                                            .map((p, i) => (
                                                <Box
                                                    bgColor="white"
                                                    cursor="pointer"
                                                    _hover={{
                                                        bgColor: 'cyan.50',
                                                    }}
                                                    onClick={() =>
                                                        selectProduct(p)
                                                    }
                                                    borderWidth={1}
                                                    borderRadius="md"
                                                    p={2}
                                                    key={p._id ?? ''}
                                                    w="100%"
                                                >
                                                    <Flex
                                                        flexWrap="wrap"
                                                        alignItems="center"
                                                    >
                                                        <Text
                                                            fontWeight="bold"
                                                            mr={1}
                                                        >
                                                            {p.name}
                                                        </Text>
                                                        {p.brand && (
                                                            <Text
                                                                fontSize="sm"
                                                                color="gray.500"
                                                                mr={1}
                                                            >
                                                                {p.brand}
                                                            </Text>
                                                        )}
                                                    </Flex>
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.500"
                                                        noOfLines={2}
                                                    >
                                                        {p.description}
                                                    </Text>
                                                    <Text>
                                                        {formatter.format(
                                                            p.price
                                                        )}
                                                    </Text>
                                                </Box>
                                            ))}
                                    </VStack>
                                )}
                            </Box>
                        </Box>
                    )}
                </VStack>
                <Box px={2} flex="1">
                    {selected ? (
                        <Card>
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <VStack align="start">
                                        <ValidatedInput
                                            label="Name"
                                            placeholder="Name"
                                            {...castInputProps({
                                                field: 'name',
                                                registerOptions: {
                                                    required:
                                                        'This is required',
                                                },
                                            })}
                                        />
                                        <ValidatedInput
                                            label="Brand"
                                            placeholder="Brand"
                                            {...castInputProps({
                                                field: 'brand',
                                                registerOptions: {},
                                            })}
                                        />
                                        <ValidatedInput
                                            label="Price"
                                            type="number"
                                            placeholder="Price"
                                            {...castInputProps({
                                                field: 'price',
                                                registerOptions: {
                                                    required:
                                                        'This is required',
                                                    min: {
                                                        message:
                                                            'Minimum value should be 0',
                                                        value: 0,
                                                    },
                                                },
                                            })}
                                        />
                                        <ValidatedInput
                                            label="Description"
                                            placeholder="Description"
                                            type="textarea"
                                            {...castInputProps({
                                                field: 'description',
                                                registerOptions: {
                                                    required:
                                                        'This is required',
                                                },
                                            })}
                                        />
                                        <ValidatedInput
                                            label="Stock units"
                                            placeholder="Stock"
                                            type="number"
                                            {...castInputProps({
                                                field: 'stock',
                                                registerOptions: {
                                                    min: {
                                                        message:
                                                            'Stock can not be negative',
                                                        value: 0,
                                                    },
                                                },
                                            })}
                                        />
                                        {imageSrc ? (
                                            <Image
                                                w="100%"
                                                objectFit="contain"
                                                height="xs"
                                                src={
                                                    typeof imageSrc === 'string'
                                                        ? imageSrc
                                                        : ''
                                                }
                                                alt={selected.name}
                                            />
                                        ) : (
                                            <Center w="100%" height="xs">
                                                <Text>No image</Text>
                                            </Center>
                                        )}
                                        <Flex my={2} w="100%">
                                            <FileUpload
                                                accept="image/*"
                                                register={register('image', {})}
                                            >
                                                <Button
                                                    variant="outline"
                                                    colorScheme="blackAlpha"
                                                >
                                                    Update image
                                                </Button>
                                            </FileUpload>
                                            {!adding ? (
                                                <ButtonGroup>
                                                    <Button
                                                        onClick={deleteProduct}
                                                        colorScheme="red"
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        colorScheme="green"
                                                        type="submit"
                                                    >
                                                        Update
                                                    </Button>
                                                </ButtonGroup>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    colorScheme="green"
                                                >
                                                    Create
                                                </Button>
                                            )}
                                        </Flex>
                                    </VStack>
                                </form>
                            </FormProvider>
                        </Card>
                    ) : (
                        <Center>
                            <Text color="gray.300">
                                There is no product selected
                            </Text>
                        </Center>
                    )}
                </Box>
            </Stack>
            <EventModal {...eventState} />
        </Container>
    );
};

export default Products;
