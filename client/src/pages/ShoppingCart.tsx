import {
    Avatar,
    Box,
    Container,
    Heading,
    HStack,
    Spinner,
    Stack,
} from '@chakra-ui/react';
import useProducts from '../hooks/useProducts';
import useShoppingCart from '../hooks/useShoppingCart';
import useUser from '../hooks/useUser';

const ShoppingCart = () => {
    const { del, add, products: cartProducts } = useShoppingCart();
    const { products, loading, error } = useProducts();
    const { user, isLoading, pictureSrc } = useUser();

    if (loading || isLoading) return <Spinner />;

    return (
        <Container maxW="container.md" py={8}>
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
        </Container>
    );
};

export default ShoppingCart;
