import { DeleteIcon } from '@chakra-ui/icons';
import {
    Box,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    Link,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Product } from '../types/Product';
import { formatter } from '../utils';

const OrderItemSummary = ({
    product,
    quantity,
    bottomComponent,
}: {
    product: Product | null | undefined;
    quantity: number;
    bottomComponent?: ReactNode;
}) => {
    if (!product)
        return (
            <Box py={4}>
                <Text color="gray.500">
                    {' '}
                    Product details no longer available
                </Text>
            </Box>
        );
    return (
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
                        <Link
                            fontWeight="bold"
                            fontSize="lg"
                            as={RouterLink}
                            to={`/product/${product._id}`}
                            size="md"
                        >
                            {product.name}
                        </Link>
                        {product.brand && (
                            <Text
                                lineHeight="shorter"
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.500"
                            >
                                By {product.brand}
                            </Text>
                        )}
                        <Stat size="sm">
                            <StatNumber>
                                {formatter.format(product.price)}
                            </StatNumber>
                        </Stat>
                    </Box>
                    <Stack direction={['column', 'row']} align="center">
                        <Stat size="sm">
                            <StatLabel>Cost</StatLabel>
                            <StatNumber>
                                {formatter.format(
                                    product.price * (quantity ?? 0)
                                )}
                            </StatNumber>
                        </Stat>
                        {bottomComponent}
                    </Stack>
                </Flex>
            </Stack>
            <Divider mt={4} />
        </Box>
    );
};

export default OrderItemSummary;
