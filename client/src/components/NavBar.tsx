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
import { useMemo } from 'react';
import { AiOutlineShoppingCart, AiFillCaretDown } from 'react-icons/ai';

import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';

const NavBar = ({ ...props }: BoxProps) => {
    const { logOut } = useAuth();
    const { user } = useUser();

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
