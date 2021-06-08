import {
    Avatar,
    Badge,
    Box,
    BoxProps,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { AiOutlineShoppingCart, AiFillCaretDown } from 'react-icons/ai';

import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useShoppingCart from '../hooks/useShoppingCart';
import useUser from '../hooks/useUser';

const NavBar = ({ ...props }: BoxProps) => {
    const { logOut } = useAuth();
    const { user } = useUser();
    const { products } = useShoppingCart();

    const pictureSrc = useMemo(() => {
        if (!user?.profilePicture) return '';
        if (typeof user?.profilePicture === 'string') {
            return user?.profilePicture;
        } else if (user?.profilePicture?.data) {
            return `data:${user.profilePicture.contentType};base64,${user.profilePicture.data}`;
        }

        return '';
    }, [user]);

    if (!user) return null;

    return (
        <Box py={3} w="100%" borderBottomWidth={1} bgColor="teal" color="white">
            <Flex alignItems="center" justifyContent="space-around" w="100%">
                <Heading size="md" mx={3} as={RouterLink} to="/">
                    Shopping {user.role === 'admin' && <Badge>ADMIN</Badge>}
                </Heading>
                <HStack alignItems="center">
                    {user.role === 'user' && (
                        <Box position="relative">
                            <IconButton
                                _hover={{
                                    color: 'teal.500',
                                    bgColor: 'whiteAlpha.900',
                                }}
                                as={RouterLink}
                                to="/cart"
                                variant="ghost"
                                borderRadius="full"
                                aria-label="shopping cart"
                                icon={<AiOutlineShoppingCart />}
                            />
                            {products.length > 0 && (
                                <Badge
                                    position="absolute"
                                    top="0"
                                    fontSize="xs"
                                    rounded="full"
                                    right="0"
                                    colorScheme="red"
                                >
                                    {products.length}
                                </Badge>
                            )}
                        </Box>
                    )}
                    <Button
                        _hover={{
                            color: 'teal.500',
                            bgColor: 'whiteAlpha.900',
                        }}
                        variant="ghost"
                        rounded="full"
                        px={2}
                        as={RouterLink}
                        to="/profile"
                    >
                        <Avatar
                            size="xs"
                            src={pictureSrc}
                            name={`${user.givenName} ${user.lastName}`}
                            mr={2}
                        />{' '}
                        {user.givenName}
                    </Button>
                    <Menu>
                        <MenuButton
                            _hover={{
                                color: 'teal.500',
                                bgColor: 'whiteAlpha.900',
                            }}
                            _active={{
                                color: 'teal.500',
                                bgColor: 'whiteAlpha.900',
                            }}
                            variant="ghost"
                            as={IconButton}
                            borderRadius="full"
                            aria-label="options"
                            icon={<AiFillCaretDown />}
                        ></MenuButton>
                        <MenuList color="black">
                            {user.role === 'user' && (
                                <>
                                    <MenuItem as={RouterLink} to="/profile">
                                        Profile
                                    </MenuItem>
                                    <MenuItem as={RouterLink} to="/orders">
                                        My Orders
                                    </MenuItem>
                                </>
                            )}
                            <MenuItem onClick={logOut}>Log Out</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </Box>
    );
};

export default NavBar;
