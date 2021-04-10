import React, { FC, useState, useRef } from "react";
import Hue from "react-color/lib/components/hue/Hue";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Flex,
  Stack,
  Code,
  Spacer,
  Input,
  FormHelperText,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

const AddComponentModal: FC<any> = ({ isOpen, onClose, onSubmit }) => {
  const nameEl = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");

  const isValid = !!name && !!key && !key.includes(" ");

  return (
    <Modal
      initialFocusRef={nameEl}
      isOpen={isOpen}
      isCentered
      onClose={onClose}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <ModalHeader>Add a Component</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Component Name</FormLabel>
              <Input
                ref={nameEl}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="eg: Example Form"
              />
              <Spacer h={4} />
              <FormLabel>Component Key</FormLabel>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eg: Form"
              />
              <FormHelperText>
                This will point to <Code>theme.components[component_key]</Code>
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="blue"
              mr={3}
              onClick={() => onSubmit({ name, key })}
              disabled={!isValid}
            >
              Add Component
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddComponentModal;
