import React, { useState, FC } from "react";
import {
  Flex,
  Box,
  IconButton,
  SimpleGrid,
  ChakraProvider,
  useDisclosure,
  CloseButton,
  Stack,
  Text,
  theme as DEFAULT_THEME,
  extendTheme,
  useColorMode,
  Center,
  Switch,
  useColorModeValue,
  FormControl,
  FormLabel,
  Tooltip,
} from "@chakra-ui/react";
import {
  IoMdCode as CodeIcon,
  IoMdClose as CloseIcon,
  IoMdColorPalette as ColorIcon,
  IoMdAddCircleOutline as AddIcon,
} from "react-icons/io";
import {
  BiFontFamily as FontIcon,
  BiDownload as DownloadIcon,
} from "react-icons/bi";
import "./App.css";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import MotionBox from "./MotionBox";
import ComponentItem from "./ComponentItem";
import manager from "./ThemeManager";
import { observer } from "mobx-react-lite";
import { Editor } from "./Editor";
import { autorun } from "mobx";
import PaletteModal from "./PaletteModal";
import AddComponentModal from "./AddComponentModal";
import downloadFile from "js-file-download";

import * as fonts from "./fonts";
import FontLoaderModal from "./FontLoaderModal";

const variants = {
  menu: {
    open: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: 1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },
  menuItem: {
    open: {
      opacity: 1,
      x: 0,
    },
    closed: {
      opacity: 0,
      x: 36,
    },
  },
};

const CodeMenu: FC<any> = ({
  onClick,
  onColorsClick,
  onFontsClick,
  onDownloadClick,
  isOpen,
  ...otherProps
}) => {
  return (
    <Stack spacing={3} {...otherProps}>
      <Tooltip placement="left" label={isOpen ? "Hide Code" : "Show Code"}>
        <IconButton
          colorScheme="whiteAlpha"
          color="whiteAlpha.600"
          onClick={onClick}
          bg="#212121"
          aria-label="show code"
          variant="outline"
          icon={isOpen ? <CloseIcon /> : <CodeIcon />}
        />
      </Tooltip>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={variants.menu}
            style={{ paddingTop: "6px" }}
            initial="closed"
            animate={"open"}
            exit={"closed"}
          >
            <motion.div
              variants={variants.menuItem}
              style={{ padding: "6px 0" }}
            >
              <Tooltip placement="left" label="Open Palettes">
                <IconButton
                  variant="outline"
                  colorScheme="whiteAlpha"
                  color="whiteAlpha.600"
                  bg="#212121"
                  onClick={onColorsClick}
                  aria-label="colors"
                  icon={<ColorIcon />}
                />
              </Tooltip>
            </motion.div>
            <motion.div
              variants={variants.menuItem}
              style={{ padding: "6px 0" }}
            >
              <Tooltip placement="left" label="Open Fonts">
                <IconButton
                  variant="outline"
                  colorScheme="whiteAlpha"
                  color="whiteAlpha.600"
                  bg="#212121"
                  onClick={onFontsClick}
                  aria-label="fonts"
                  icon={<FontIcon />}
                />
              </Tooltip>
            </motion.div>
            <motion.div
              variants={variants.menuItem}
              style={{ padding: "6px 0" }}
            >
              <Tooltip placement="left" label="Download Theme File">
                <IconButton
                  variant="outline"
                  colorScheme="whiteAlpha"
                  color="whiteAlpha.600"
                  bg="#212121"
                  onClick={onDownloadClick}
                  aria-label="download"
                  icon={<DownloadIcon />}
                />
              </Tooltip>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
};

// save to local storage
autorun(
  () => {
    localStorage.setItem("data", JSON.stringify(manager.data));
  },
  {
    delay: 3000,
  }
);

const App = observer(() => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const modals = {
    color: useDisclosure(),
    component: useDisclosure(),
    font: useDisclosure(),
  };
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = manager.theme;
  const cardBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.50");

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 500, damping: 50 }}>
      <Flex h="100%">
        <Flex direction="column" className="content" flex={1}>
          <Flex
            className="header"
            h="64px"
            align="center"
            justify="space-between"
            px={4}
            borderBottom="1px solid"
            borderColor="whiteAlpha.200"
            bg="#212121"
            color="white"
          >
            <Text fontSize="md" fontWeight="bold">
              Chakra Theme Tool
            </Text>
            <Box flex={1} />
            <FormControl
              w="auto"
              display="flex"
              alignItems="center"
              pos="relative"
              right={sidebarOpen ? 0 : "48px"}
              transition="right .4s"
            >
              <FormLabel fontSize="sm" mb={0} htmlFor="dark-mode-switch">
                Dark Mode
              </FormLabel>
              <Switch
                id="dark-mode-switch"
                colorScheme="brand"
                isChecked={colorMode === "dark"}
                onChange={(e) => {
                  toggleColorMode();
                }}
              />
            </FormControl>
          </Flex>
          <Box className="main" flex={1} pos="relative" overflowY="auto">
            <SimpleGrid
              display={manager.getSelected() ? "none" : "grid"}
              columns={[1, 1, 1, 1, 2, 2, 3]}
              spacing={8}
              p={8}
            >
              {manager.componentKeys.map((componentKey) => (
                <Box
                  key={componentKey}
                  height="250px"
                  bg={cardBg}
                  overflow="hidden"
                  rounded="xl"
                  cursor="pointer"
                  onClick={() => manager.setSelected(componentKey)}
                  transition="all .25s"
                  _hover={{ transform: "scale(1.015)", boxShadow: "md" }}
                  boxShadow={"sm"}
                >
                  <ComponentItem
                    mode={
                      manager.getSelected() === componentKey
                        ? "expanded"
                        : "grid-item"
                    }
                    componentKey={componentKey}
                  />
                </Box>
              ))}
              <Box
                height="250px"
                bg={cardBg}
                overflow="hidden"
                rounded="xl"
                cursor="pointer"
                onClick={modals.component.onOpen}
                transition="all .25s"
                _hover={{ transform: "scale(1.015)", boxShadow: "md" }}
                boxShadow={"sm"}
              >
                <Center flexDirection="column" h="100%" fontSize="xl">
                  <Text fontSize="md" fontWeight="bold">
                    Add a Component
                  </Text>
                  <AddIcon />
                </Center>
              </Box>
            </SimpleGrid>
            {manager.getSelected() && (
              <Box
                pos="absolute"
                top={0}
                right={0}
                bottom={0}
                left={0}
                height="100%"
                bg={cardBg}
                overflowY="auto"
              >
                <ComponentItem
                  mode="expanded"
                  componentKey={manager.getSelected()}
                />
                <CloseButton
                  pos="absolute"
                  top="12px"
                  right="12px"
                  onClick={() => manager.setSelected(null)}
                />
              </Box>
            )}
          </Box>
        </Flex>
        <MotionBox
          className="sidebar"
          borderLeft="1px solid"
          borderColor="gray.700"
          w="480px"
          animate={{
            marginRight: sidebarOpen ? 0 : "-480px",
          }}
        >
          <Editor />
        </MotionBox>
      </Flex>
      <PaletteModal
        isOpen={modals.color.isOpen}
        onClose={modals.color.onClose}
      />
      <FontLoaderModal
        isOpen={modals.font.isOpen}
        onClose={modals.font.onClose}
      />
      <AddComponentModal
        isOpen={modals.component.isOpen}
        onClose={modals.component.onClose}
        onSubmit={(data: any) => {
          manager.addComponent(data);
          modals.component.onClose();
        }}
      />
      <CodeMenu
        onClick={() => setSidebarOpen((p) => !p)}
        onColorsClick={modals.color.onOpen}
        onFontsClick={modals.font.onOpen}
        onDownloadClick={() => {
          downloadFile(manager.themeStr, "theme.js");
        }}
        isOpen={sidebarOpen}
        pos="fixed"
        top={"12px"}
        right={"12px"}
        zIndex={100}
      />
    </MotionConfig>
  );
});

export default App;
