import React, { FC, useState, useRef, useEffect } from "react";
import Hue from "react-color/lib/components/hue/Hue";
import manager from "./ThemeManager";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Checkbox,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  useClipboard,
  Input,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import * as fontService from "./fonts";
import { autorun } from "mobx";
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from "constants";

autorun(() => {
  const selectedFonts = manager.getSelectedFonts();
  if (selectedFonts.length) {
    fontService.load(manager.getSelectedFonts());
  }
});

const FontLoaderModal: FC<any> = observer(({ isOpen, onClose, onSubmit }) => {
  const nameEl = useRef<HTMLInputElement>(null);
  const [fonts, setFonts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fontService.list().then(setFonts);
  }, []);

  const selectedFonts = manager.getSelectedFonts();

  const fontFamiliesStr = selectedFonts.reduce(
    (str: string, fontFamily: string, i: number) => {
      str += `'${fontFamily}'`;
      if (i < selectedFonts.length - 1) {
        str += ", ";
      }
      return str;
    },
    ""
  );

  const { hasCopied, onCopy } = useClipboard(
    JSON.stringify(
      {
        body: fontFamiliesStr,
        heading: fontFamiliesStr,
        mono: fontFamiliesStr,
      },
      null,
      2
    )
  );

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
        <ModalHeader>Manage Loaded Fonts</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Wrap>
              {selectedFonts.map((fontFamily) => (
                <Tag
                  size={"md"}
                  key={fontFamily}
                  borderRadius="md"
                  variant="outline"
                  colorScheme="blue"
                >
                  <TagLabel>{fontFamily}</TagLabel>
                  <TagCloseButton
                    onClick={() => manager.unselectFont(fontFamily)}
                  />
                </Tag>
              ))}
            </Wrap>
            <Stack h={300} px={1} spacing={1} overflowY="auto">
              {fonts
                .filter((font: any) =>
                  font.family.toLowerCase().includes(search.toLowerCase())
                )
                .slice(0, 250)
                .map((font: any) => (
                  <Checkbox
                    isChecked={selectedFonts.includes(font.family)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        manager.selectFont(font.family);
                      } else {
                        manager.unselectFont(font.family);
                      }
                    }}
                  >
                    {font.family}
                  </Checkbox>
                ))}
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onCopy}>
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default FontLoaderModal;
