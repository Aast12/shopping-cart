import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

const Card = ({
    children,
    ...props
}: BoxProps & { children?: React.ReactNode }) => {
    return (
        <Box borderWidth={1} p={4} borderRadius="lg" bgColor="white" {...props}>
            {children}
        </Box>
    );
};

export default Card;
