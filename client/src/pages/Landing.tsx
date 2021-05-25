import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Input,
    Link,
    Text,
    VStack,
} from '@chakra-ui/react';
import Card from '../components/Card';

const Landing = () => {
    return (
        <Box>
            <Flex
                direction={['column', 'row']}
                sx={{ '& > *': { mx: '2', flex: 1 } }}
                h="100vh"
            >
                <Center>
                    <Heading>Shopping Cart</Heading>
                </Center>
                <Center>
                    <Card minW="md">
                        <VStack align="start" spacing={3}>
                            <Heading>Log In</Heading>
                            <Input placeholder="email" />
                            <Input placeholder="password" type="password" />
                            <Button w="100%">Log In</Button>
                            <Flex
                                direction={['column', 'row']}
                                justifyContent="space-between"
                                w="100%"
                            >
                                <Link color="blue.300" mt={0} fontSize="sm">
                                    Forgot password?
                                </Link>
                                <Text fontSize="sm">
                                    Not registered yet?{' '}
                                    <Link color="blue.300">Sign Up</Link>
                                </Text>
                            </Flex>
                        </VStack>
                    </Card>
                </Center>
            </Flex>
        </Box>
    );
};

export default Landing;
