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
            create(payload);
        } else if (selected?._id) {
            edit({
                ...payload,
                _id: selected._id,
            });
        }
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
            <Flex my={2} direction={isCompact ? 'column' : 'row'}>
                <VStack as="aside" w={isCompact ? '100%' : 'xs'} px={2} pb={2}>
                    {isCompact && (
                        <Select
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
                        leftIcon={<AiOutlinePlus />}
                        onClick={() => {
                            selectProduct({} as Product);
                            setAdding(true);
                        }}
                    >
                        Add Product
                    </Button>
                    {!isCompact && (
                        <>
                            <InputGroup w="100%">
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
                            <Box w="100%">
                                {products.length === 0 ? (
                                    <Text w="100%" textAlign="center">
                                        There are no products
                                    </Text>
                                ) : (
                                    <VStack w="100">
                                        {products
                                            .filter((p) =>
                                                p.name
                                                    .toLowerCase()
                                                    .includes(filter)
                                            )
                                            .map((p, i) => (
                                                <Box
                                                    cursor="pointer"
                                                    _hover={{
                                                        bgColor: 'gray.50',
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
                                                    <Text>{p.name}</Text>
                                                    <Text>{p.description}</Text>
                                                    <Text>{p.price}</Text>
                                                </Box>
                                            ))}
                                    </VStack>
                                )}
                            </Box>
                        </>
                    )}
                </VStack>
                <Box px={2} flex="1">
                    {selected ? (
                        <Box>
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
                                                    min: 0,
                                                },
                                            })}
                                        />
                                        {imageSrc && (
                                            <Image
                                                src={
                                                    typeof imageSrc === 'string'
                                                        ? imageSrc
                                                        : ''
                                                }
                                                alt={selected.name}
                                            />
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
                                                    Edit image
                                                </Button>
                                            </FileUpload>
                                            {!adding ? (
                                                <ButtonGroup>
                                                    <Button
                                                        onClick={() =>
                                                            selected?._id &&
                                                            del(selected._id)
                                                        }
                                                        colorScheme="red"
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        colorScheme="green"
                                                        // onClick={() => {
                                                        //     // Submit
                                                        // }}
                                                        type="submit"
                                                    >
                                                        Update
                                                    </Button>
                                                </ButtonGroup>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    colorScheme="green"
                                                    // onClick={() => {}}
                                                >
                                                    Create
                                                </Button>
                                            )}
                                        </Flex>
                                    </VStack>
                                </form>
                            </FormProvider>
                        </Box>
                    ) : (
                        <Center>
                            <Text color="gray.300">
                                There is no product selected
                            </Text>
                        </Center>
                    )}
                </Box>
            </Flex>
        </Container>
    );
};

export default Products;
