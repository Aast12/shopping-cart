import {
    Avatar,
    Box,
    BoxProps,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import { AiOutlineShoppingCart, AiFillCaretDown } from 'react-icons/ai';

import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NavBar = ({ ...props }: BoxProps) => {
    const { logOut } = useAuth();

    return (
        <Box py={3} w="100%" borderBottomWidth={1}>
            <Flex alignItems="center" justifyContent="space-around" w="100%">
                <Heading size="md" mx={3} as={RouterLink} to="/">
                    Shopping
                </Heading>
                <HStack alignItems="center">
                    <Link as={RouterLink} to="/products">
                        Explore
                    </Link>
                    <IconButton
                        variant="ghost"
                        borderRadius="full"
                        aria-label="shopping cart"
                        icon={<AiOutlineShoppingCart />}
                    />
                    <Button
                        variant="ghost"
                        rounded="full"
                        px={2}
                        as={RouterLink}
                        to="/profile"
                    >
                        <Avatar size="xs" src="" name="Jon Doe" mr={2} /> Jon
                    </Button>
                    <Menu>
                        <MenuButton
                            variant="ghost"
                            as={IconButton}
                            borderRadius="full"
                            aria-label="options"
                            icon={<AiFillCaretDown />}
                        ></MenuButton>
                        <MenuList>
                            <MenuItem as={RouterLink} to="/profile">
                                Profile
                            </MenuItem>
                            <MenuItem onClick={logOut}>Log Out</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </Box>
    );
};

export default NavBar;
