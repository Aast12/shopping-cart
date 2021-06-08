import {
    Box,
    Container,
    Divider,
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import OrderItemSummary from '../components/OrderItemSummary';
import useProducts from '../hooks/useProducts';
import { RootState } from '../redux/store';
import { Order } from '../types/Users';
import { formatter } from '../utils';

const Orders = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const { products, loading } = useProducts();
    const orders = useMemo(() => {
        return user?.orders;
    }, [user]);

    const { isOpen, onClose, onOpen } = useDisclosure();
    const [previewOrder, setPreviewOrder] = useState<Order>();

    const filteredOrders = useMemo(() => {
        if (orders) {
            return orders.slice().sort((o1, o2) => {
                return o2.date.localeCompare(o1.date);
            });
        }
        return [];
    }, [orders]);

    if (!user) return <Text>You are not logged in</Text>;

    return (
        <Container maxW="container.md" py={8}>
            <Heading>My Orders</Heading>
            <Divider my={2} />
            <Text color="gray.500">{filteredOrders?.length} Order(s)</Text>
            <Card my={4}>
                {filteredOrders?.length === 0 && (
                    <Text color="gray.500">You haven't done any order.</Text>
                )}
                {filteredOrders?.map((order) => {
                    const { date, products, total, _id } = order;
                    return (
                        <Box
                            key={_id}
                            _hover={{ bgColor: 'cyan.50' }}
                            transition="all 0.1s ease-out"
                            cursor="pointer"
                            onClick={() => {
                                setPreviewOrder(order);
                                onOpen();
                            }}
                        >
                            <Box>
                                <Flex p={3} justifyContent="space-between">
                                    <Text fontSize="sm" color="gray.500">
                                        Date:{' '}
                                        {moment(date).format(
                                            'dddd, MMMM Do YYYY, h:mm:ss a'
                                        )}
                                    </Text>
                                    <Text fontSize="sm" color="cyan.600">
                                        OrderID: {_id}
                                    </Text>
                                </Flex>
                                <Box p={3}>
                                    <Stat>
                                        <StatLabel>Total</StatLabel>
                                        <StatNumber>
                                            {formatter.format(total)}
                                        </StatNumber>
                                        <StatHelpText>
                                            Product(s): {products.length}
                                        </StatHelpText>
                                    </Stat>
                                </Box>
                            </Box>
                            <Divider my={2} />
                        </Box>
                    );
                })}
            </Card>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Text>Order Details</Text>
                        <Text
                            fontSize="sm"
                            fontWeight="normal"
                            color="cyan.600"
                        >
                            ID: {previewOrder?._id}
                        </Text>
                        <Text
                            fontSize="sm"
                            fontWeight="normal"
                            color="gray.500"
                        >
                            {moment(previewOrder?.date).format(
                                'dddd, MMMM Do YYYY, h:mm a'
                            )}
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {loading && <Spinner />}
                        {!loading &&
                            previewOrder?.products.map(
                                ({ product, quantity, unitPrice }) => {
                                    const productData = products.find(
                                        (p) => p._id === product
                                    );

                                    if (productData)
                                        productData.price = unitPrice;

                                    return (
                                        <OrderItemSummary
                                            quantity={quantity}
                                            product={productData}
                                            bottomComponent={
                                                <Text>
                                                    Quantity: {quantity}
                                                </Text>
                                            }
                                        />
                                    );
                                }
                            )}
                    </ModalBody>

                    <ModalFooter>
                        <Stat>
                            <StatLabel>Total</StatLabel>
                            <StatNumber>
                                {formatter.format(previewOrder?.total ?? 0)}
                            </StatNumber>
                        </Stat>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Orders;
