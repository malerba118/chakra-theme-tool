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
  useColorModeValue,
} from "@chakra-ui/react";
import * as chroma from "chroma-js";
import { ChromePicker } from "react-color";
import _ from "lodash";

const Color: FC<any> = ({ color }) => {
  return <Flex w="100%" h="48px" bg={color}></Flex>;
};

const SATURATIONS = [0.32, 0.16, 0.08, 0.04, 0, 0, 0.04, 0.08, 0.16, 0.32];
const LIGHTNESSES = [
  0.95,
  0.85,
  0.75,
  0.65,
  0.55,
  0.45,
  0.35,
  0.25,
  0.15,
  0.05,
];

const PaletteModal: FC<any> = ({ isOpen, onClose }) => {
  const [hex, setHex] = useState("#A600FF");

  const styles = useColorModeValue(
    {
      bg: "blackAlpha.100",
    },
    {
      bg: "whiteAlpha.100",
    }
  );

  const selectedColor = chroma.hex(hex);

  const targetLightness = _.minBy(LIGHTNESSES, (lightness) =>
    Math.abs(lightness - selectedColor.get("hsl.l"))
  ) as number;

  const colorIndex = LIGHTNESSES.indexOf(targetLightness);

  const colors = LIGHTNESSES.map((lightness, i) => {
    const color = selectedColor.set("hsl.l", lightness);
    const delta = SATURATIONS[i] - SATURATIONS[colorIndex];
    return delta >= 0
      ? color.saturate(delta).hex()
      : color.desaturate(-delta).hex();
  });

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
            <Box
              onDragStart={(e) => e.preventDefault()}
              borderRadius="md"
              overflow="hidden"
              border="none"
              bg={styles.bg}
            >
              <ChromePicker
                className="colorpicker"
                color={hex}
                onChange={({ hex }) => setHex(hex)}
                disableAlpha
              />
            </Box>
            <Flex borderRadius="lg" overflow="hidden">
              {Object.keys(scale).map((colorKey) => (
                <Box flex={1}>
                  <Color key={colorKey} color={scale[colorKey]} />
                </Box>
              ))}
            </Flex>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={onCopy}>
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaletteModal;
