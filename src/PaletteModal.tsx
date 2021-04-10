import React, { FC, useState } from "react";
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
  Text,
  useClipboard,
} from "@chakra-ui/react";
import * as chroma from "chroma-js";
import { ChromePicker } from "react-color";

const Color: FC<any> = ({ color }) => {
  return <Flex w="100%" h="48px" bg={color}></Flex>;
};

const PaletteModal: FC<any> = ({ isOpen, onClose }) => {
  const [hex, setHex] = useState("#ff0000");

  const colors = chroma
    .scale([chroma.hex(hex).luminance(0.8), chroma.hex(hex).luminance(0.25)])
    .mode("lab")
    .colors(10);

  const scale = colors.reduce((obj, color, index) => {
    if (index === 0) {
      obj[50] = color;
    } else {
      obj[index * 100] = color;
    }
    return obj;
  }, {} as any);

  const { hasCopied, onCopy } = useClipboard(JSON.stringify(scale, null, 2));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Color Scale</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={5}>
            <ChromePicker
              className="colorpicker"
              color={hex}
              onChange={({ hex }) => setHex(hex)}
              disableAlpha
            />
            <Flex>
              {Object.keys(scale).map((colorKey) => (
                <Box flex={1}>
                  <Color key={colorKey} color={scale[colorKey]} />
                </Box>
              ))}
            </Flex>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onCopy}>
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaletteModal;
