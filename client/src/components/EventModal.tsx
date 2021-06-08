import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Spinner,
    ModalFooter,
    Modal,
    Center,
    Button,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';

import { useEffect } from 'react';

type EventModalProps = {
    gotError: boolean;
    gotSuccess: boolean;
    isLoading: boolean;
    successMessage: string;
    errorMessage: string;
};

const EventModal = ({
    isLoading,
    gotError,
    gotSuccess,
    errorMessage,
    successMessage,
}: EventModalProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    useEffect(() => {
        if (isLoading) {
            onOpen();
        }
    }, [isLoading, onOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior="inside"
            isCentered
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center"></ModalHeader>
                <ModalBody>
                    {isLoading && (
                        <Center w="100%">
                            <Spinner />
                        </Center>
                    )}
                    {!isLoading && gotError && (
                        <VStack color="red.400" spacing={4}>
                            <CloseIcon fontSize="5xl" />
                            <Text fontWeight="bold">{errorMessage}</Text>
                        </VStack>
                    )}
                    {!isLoading && gotSuccess && !gotError && (
                        <VStack color="green.400" spacing={4}>
                            <CheckIcon fontSize="5xl" />
                            <Text fontWeight="bold">{successMessage}</Text>
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter justifyContent="center">
                    <Button
                        variant="ghost"
                        disabled={isLoading}
                        onClick={onClose}
                        colorScheme="teal"
                    >
                        OK
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EventModal;
