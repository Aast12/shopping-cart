import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Text,
    Textarea,
    InputGroup,
    InputLeftElement,
    Heading,
    VStack,
    useBreakpointValue,
    Select,
    ButtonGroup,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Product } from '../../types/Products';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState('');

    const [selected, setSelected] = useState<Product | undefined>();
    const [adding, setAdding] = useState<boolean>(false);
    const { handleSubmit, register, setValue } =
        useForm<Product & { image: FileList }>();
    const isCompact = useBreakpointValue({ base: true, md: false });

    const onSubmit = ({
        description,
        image,
        ...values
    }: Product & { image: FileList }) => {
        if (adding) {
            createProduct({
                ...values,
                description: description ?? '',
                image: image[0],
            });
        } else if (values._id) {
            editProduct({
                ...values,
                description: description ?? '',
                image: image[0],
            });
        }
    };

    const createProduct = async (values: {
        name: string;
        price: number;
        description: string;
        image: File;
    }) => {
        const form = new FormData();
        Object.keys(values).forEach((key) => {
            // @ts-ignore
            form.append(key, values[key]);
        });

        await axios
            .post('/products/create', form)
            .then(console.log)
            .catch(console.error);
    };

    const deleteProduct = async () => {
        const id = selected?._id;
        await axios
            .delete('/products/delete', { data: { id } })
            .then((res) => {
                console.log(res);
                setProducts(products.filter((p) => p._id !== id));
            })
            .catch(console.error);
    };

    const editProduct = async (values: {
        _id?: string;
        name: string;
        price: number;
        description: string;
        image: File;
    }) => {
        const form = new FormData();
        Object.keys(values).forEach((key) => {
            // @ts-ignore
            form.append(key, values[key]);
        });

        await axios
            .post('/products/update', form)
            .then(console.log)
            .catch(console.error);
    };

    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then((res) => {
                console.log(res);
                return res.json();
            })
            .then((res) => {
                console.log(res);
                setProducts(res);
            });
    }, []);

    const setValues = (values: Product) => {
        setValue('name', values.name);
        setValue('price', values.price);
        setValue('description', values.description);
        // setValue('name', values.);
    };

    const selectProduct = (product: Product | undefined) => {
        if (product) {
            setSelected(product);
            setAdding(false);
            setValues(product);
        }
    };

    return (
        <Container maxW="container.lg" py={4}>
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
                                        value={p._id}
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
                                    onChange={(e) => setFilter(e.target.value.toLowerCase())}
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
                                                    key={p._id}
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
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FormControl>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Name"
                                        {...register('name', {
                                            required: 'This is required',
                                            minLength: {
                                                value: 4,
                                                message:
                                                    'Minimum length should be 4',
                                            },
                                        })}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel htmlFor="price">Price</FormLabel>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="Price"
                                        min="0"
                                        {...register('price', {
                                            required: 'This is required',
                                            min: {
                                                message:
                                                    'Minimum value should be 0',
                                                value: 0,
                                            },
                                        })}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel htmlFor="description">
                                        Description
                                    </FormLabel>
                                    <Textarea
                                        id="description"
                                        placeholder="Description"
                                        {...register('description', {
                                            required: 'This is required',
                                            minLength: {
                                                value: 4,
                                                message:
                                                    'Minimum length should be 4',
                                            },
                                        })}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="image">Image</FormLabel>
                                    <Input
                                        id="image"
                                        type="file"
                                        {...register('image', {})}
                                    />
                                </FormControl>

                                {/* <div className="flex flex-wrap">
                                <div style="width: 250px">
                                    <label for="image" className="form-label">
                                        Image
                                    </label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="image"
                                        value=""
                                    />
                                </div>

                                <img
                                    className="hidden product-image mx-auto"
                                    src=""
                                    style="max-height: 200px"
                                />
                            </div> */}
                                <Box my={2} float="right">
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
                                                onClick={() => {
                                                    // Submit
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </ButtonGroup>
                                    ) : (
                                        <Button
                                            type="submit"
                                            colorScheme="green"
                                            onClick={() => {}}
                                        >
                                            Create
                                        </Button>
                                    )}
                                </Box>
                            </form>
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
