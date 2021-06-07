import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
    Box,
    Center,
    Container,
    Flex,
    Heading,
    IconButton,
    Image,
    LinkBox,
    LinkOverlay,
    Text,
    useBreakpointValue,
    Link,
} from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useShoppingCart from '../hooks/useShoppingCart';
import { Product } from '../types/Product';
import { formatter } from '../utils';

type ProductCardProps = {
    data: Product;
};

const ProductCard = ({
    data: { name, price, image, description, _id },
}: ProductCardProps) => {
    const { push } = useHistory();
    const { toggle, contains, products } = useShoppingCart();

    return (
        <Box
            onClick={() => push(`/product/${_id}`)}
            cursor="pointer"
            transition="all 0.1s ease-in"
            _hover={{ shadow: 'sm', bgColor: 'gray.50' }}
            bgColor="white"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
            height="3xs"
            flex="1"
            m={1}
        >
            <IconButton
                as={Link}
                aria-label="Add to cart"
                icon={_id && !contains(_id) ? <AddIcon /> : <CloseIcon />}
                position="absolute"
                zIndex={1}
                colorScheme="blackAlpha"
                top="0"
                right="0"
                m={1}
                size="sm"
                onClick={() => {
                    if (_id) toggle(_id);
                }}
            />
            <LinkBox h="100%">
                <Box w="100%" h="50%" bgColor="gray.200">
                    {image && (
                        <Image
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            src={
                                image
                                    ? `data:${image.contentType};base64,${image.data}`
                                    : 'https://bit.ly/2Z4KKcF'
                            }
                        />
                    )}
                </Box>
                <Box p="4">
                    <Heading mt="1" fontWeight="semibold" size="md" isTruncated>
                        <LinkOverlay>{name}</LinkOverlay>
                    </Heading>
                    <Text fontSize="medium" fontWeight="light">
                        {formatter.format(price)}
                    </Text>

                    <Text noOfLines={2} fontSize="xs" color="gray.500">
                        {description}
                    </Text>
                </Box>
            </LinkBox>
        </Box>
    );
};

const Feed = () => {
    const { products, loading, error } = useProducts();
    const cols = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, '2xl': 5 });

    const rows = useMemo(() => {
        const rows: Product[][] = [];
        const cValue = cols ?? 1;
        const products_ = [...products];
        // const products_ = products.filter(({ name }) =>
        //     name.toLowerCase().includes(filter.toLowerCase())
        // );

        for (let i = 0; i < products_.length / cValue; i++) {
            rows.push(products_.slice(i * cValue, (i + 1) * cValue));
        }

        return rows;
    }, [cols, products]);

    useEffect(() => {
        console.log(products);
    }, [products]);

    return (
        <Container maxW="container.lg" py={8}>
            <Heading>Explore Products</Heading>
            <Box w="100%" py={4}>
                {rows.length > 0 ? (
                    rows?.map((row, idx) => (
                        <Flex key={idx}>
                            {row.map((product, idx) => (
                                <ProductCard key={idx} data={product} />
                            ))}
                            {cols &&
                                row.length < cols &&
                                new Array(cols - row.length)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div key={i} style={{ flex: 1 }}></div>
                                    ))}
                        </Flex>
                    ))
                ) : (
                    <Center h="50vh">
                        <Text color="gray.500">No results</Text>
                    </Center>
                )}
            </Box>
        </Container>
    );
};

export default Feed;
