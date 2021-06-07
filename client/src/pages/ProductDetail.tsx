import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Container,
    Heading,
    Spinner,
    Stack,
    useBoolean,
    useToast,
    Image,
    useBreakpointValue,
    Text,
    Flex,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Stat,
    StatLabel,
    StatNumber,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useShoppingCart from '../hooks/useShoppingCart';
import { Product } from '../types/Product';
import { formatter } from '../utils';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const toast = useToast();
    const [loading, setLoading] = useBoolean();
    const [product, setProduct] = useState<Product>();
    const [cartQuantity, setCartQuantity] = useState(1);
    const { push } = useHistory();
    const { add, getById, products } = useShoppingCart();

    const addToCart = () => {
        add(id, cartQuantity);
    };

    useEffect(() => {
        console.log(products);
    }, [products]);

    useEffect(() => {
        axios
            .get(`/products/${id}`)
            .then((res) => {
                setLoading.off();
                const data: Product = res.data;
                setProduct(data);
                const cartItem = getById(data._id);
                if (cartItem) {
                    setCartQuantity(cartItem.quantity);
                }
            })
            .catch((err) => {
                toast({
                    description: 'An error ocurred!',
                    status: 'error',
                    isClosable: true,
                });
            });
    }, []);

    const compact = useBreakpointValue({ base: false, md: true });

    return (
        <Container maxW="container.lg" py={4} mb={8}>
            <Button
                leftIcon={<ArrowBackIcon />}
                onClick={() => push('/')}
                colorScheme="cyan"
                variant="ghost"
            >
                Keep Looking
            </Button>
            {loading ? (
                <Spinner />
            ) : (
                product && (
                    <Box
                        borderWidth={1}
                        my={4}
                        p={4}
                        borderRadius="lg"
                        bgColor="white"
                    >
                        <Box sx={{ '& > *': { d: 'inline' } }}>
                            <Heading mr={2}>{product?.name}</Heading>
                            {product.brand && (
                                <Heading
                                    fontWeight="medium"
                                    color="gray.500"
                                    size="md"
                                >
                                    By {product.brand}
                                </Heading>
                            )}
                        </Box>
                        <Stack direction={compact ? 'row' : 'column'} py={4}>
                            <Box
                                height="md"
                                w={compact ? '50%' : '100%'}
                                bgColor="gray.100"
                                borderRadius="lg"
                                overflow="hidden"
                                borderWidth="0"
                            >
                                {product?.image && (
                                    <Image
                                        height="100%"
                                        w="100%"
                                        objectFit="cover"
                                        src={`data:${product.image.contentType};base64,${product.image.data}`}
                                    />
                                )}
                            </Box>
                            <Flex
                                direction="column"
                                px={4}
                                justifyContent="space-between"
                            >
                                <Box>
                                    <Text color="gray.500">Description</Text>
                                    <Text fontSize="lg">
                                        {product?.description}
                                    </Text>
                                </Box>
                                <Box>
                                    <Stat my={4}>
                                        <StatLabel>Unit Price</StatLabel>
                                        <StatNumber fontSize="4xl">
                                            {formatter.format(product.price)}
                                        </StatNumber>
                                    </Stat>
                                    <Stack
                                        direction={['column', 'row']}
                                        w="100%"
                                        justifyItems="flex-end"
                                        alignItems="center"
                                    >
                                        <NumberInput
                                            size="sm"
                                            defaultValue={1}
                                            value={cartQuantity}
                                            onChange={(e) =>
                                                setCartQuantity(parseInt(e))
                                            }
                                            min={1}
                                            isDisabled={
                                                (product.stock ?? 0) === 0
                                            }
                                            max={product.stock ?? 0}
                                        >
                                            <NumberInputField focusBorderColor="red.200" />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>

                                        <Button
                                            rounded="full"
                                            colorScheme="blue"
                                            onClick={addToCart}
                                            isDisabled={
                                                (product.stock ?? 0) === 0
                                            }
                                        >
                                            Add To Cart
                                        </Button>
                                    </Stack>
                                </Box>
                            </Flex>
                        </Stack>
                    </Box>
                )
            )}
        </Container>
    );
};

export default ProductDetail;
