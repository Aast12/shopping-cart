import { DeleteIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Heading,
    HStack,
    Spinner,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    ButtonGroup,
    Image,
    Flex,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    IconButton,
    Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useMemo } from 'react';
import Card from '../components/Card';
import useProducts from '../hooks/useProducts';
import useShoppingCart from '../hooks/useShoppingCart';
import useUser from '../hooks/useUser';
import { formatter } from '../utils';

const ShoppingCart = () => {
    const { del, add, products: cartProducts, drop } = useShoppingCart();
    const { products, loading, error } = useProducts();
    const { user, isLoading, pictureSrc } = useUser();

    const filteredProducts = useMemo(() => {
        return products
            .map((product) => {
                const match = cartProducts.find((p) => p.id === product._id);

                return {
                    product,
                    quantity: match ? match.quantity : null,
                };
            })
            .filter((product) => product.quantity != null);
    }, [products, cartProducts]);

    const total = useMemo(() => {
        return filteredProducts.reduce((previous, current) => {
            return previous + current.product.price * (current.quantity ?? 0);
        }, 0);
    }, [filteredProducts]);

    const checkout = () => {
        axios
            .post('/orders/create', cartProducts)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (loading || isLoading) return <Spinner />;

    return (
        <Container maxW="container.lg" py={8}>
            <HStack>
                <Avatar
                    size="lg"
                    mr={2}
                    src={pictureSrc}
                    name={`${user?.givenName} ${user?.lastName}`}
                />
                <Box>
                    <Heading>Welcome, {user?.givenName}</Heading>
                    <Heading size="md" fontWeight="medium">
                        Here is your shopping cart
                    </Heading>
                </Box>
            </HStack>
            <Stack
                direction={['column-reverse', 'column-reverse', 'row']}
                spacing={4}
                pos="relative"
                py={8}
            >
                <Card flex="1">
                    <Heading>Cart</Heading>
                    <Divider my={2} />
                    {filteredProducts.length === 0 && (
                        <Text color="gray.500">
                            {' '}
                            Your shopping cart is empty
                        </Text>
                    )}
                    {filteredProducts.map(({ product, quantity }) => (
                        <Box py={4}>
                            <Stack direction={['column', 'row']} spacing={4}>
                                <Box
                                    h="10em"
                                    w={['100%', '10em']}
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
                                    flex="1"
                                    w="100%"
                                    direction="column"
                                    justifyContent="space-between"
                                >
                                    <Box>
                                        <Heading size="md">
                                            {product.name}
                                        </Heading>
                                        {product.brand && (
                                            <Heading
                                                size="sm"
                                                fontWeight="medium"
                                                color="gray.500"
                                            >
                                                By {product.brand}
                                            </Heading>
                                        )}
                                        <Stat size="sm">
                                            <StatNumber>
                                                {formatter.format(
                                                    product.price
                                                )}
                                            </StatNumber>
                                        </Stat>
                                    </Box>
                                    <Stack
                                        direction={['column', 'row']}
                                        align="center"
                                    >
                                        <Stat size="sm">
                                            <StatLabel>Cost</StatLabel>
                                            <StatNumber>
                                                {formatter.format(
                                                    product.price *
                                                        (quantity ?? 0)
                                                )}
                                            </StatNumber>
                                        </Stat>
                                        <HStack>
                                            <IconButton
                                                size="sm"
                                                colorScheme="red"
                                                onClick={() => del(product._id)}
                                                aria-label="Remove from cart"
                                                icon={<DeleteIcon />}
                                            />
                                            <NumberInput
                                                size="sm"
                                                defaultValue={1}
                                                value={quantity ?? 0}
                                                onChange={(e) =>
                                                    add(
                                                        product._id,
                                                        parseInt(e),
                                                        true
                                                    )
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
                                        </HStack>
                                    </Stack>
                                </Flex>
                            </Stack>
                            <Divider mt={4} />
                        </Box>
                    ))}
                </Card>
                <Box minW="xs">
                    <Card position="sticky" top="1rem">
                        <Stat>
                            <StatLabel>Total</StatLabel>
                            <StatNumber>{formatter.format(total)}</StatNumber>
                            <StatHelpText>
                                {cartProducts.length} product(s)
                            </StatHelpText>
                        </Stat>
                        <Divider my={2} />
                        <ButtonGroup>
                            <Button colorScheme="blue" onClick={checkout}>
                                Checkout
                            </Button>
                            <Button colorScheme="red" onClick={drop}>
                                Empty Cart
                            </Button>
                        </ButtonGroup>
                    </Card>
                </Box>
            </Stack>
        </Container>
    );
};

export default ShoppingCart;
