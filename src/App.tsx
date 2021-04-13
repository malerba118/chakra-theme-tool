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
  Center,
} from "@chakra-ui/react";
import {
  IoMdCode as CodeIcon,
  IoMdClose as CloseIcon,
  IoMdColorPalette as ColorIcon,
  IoMdAddCircleOutline as AddIcon,
} from "react-icons/io";
import { BiFontFamily as FontIcon } from "react-icons/bi";
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
import { ErrorBoundary } from "react-error-boundary";

import * as fonts from "./fonts";
import FontLoaderModal from "./FontLoaderModal";

const ErrorFallback: FC<any> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const variants = {
  menu: {
    open: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.1,
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
  isOpen,
  ...otherProps
}) => {
  return (
    <Stack spacing={3} {...otherProps}>
      <IconButton
        colorScheme="whiteAlpha"
        onClick={onClick}
        bg="#212121"
        aria-label="show code"
        variant="outline"
        icon={isOpen ? <CloseIcon /> : <CodeIcon />}
      />
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
              <IconButton
                variant="outline"
                colorScheme="whiteAlpha"
                bg="#212121"
                onClick={onColorsClick}
                aria-label="colors"
                icon={<ColorIcon />}
              />
            </motion.div>
            <motion.div
              variants={variants.menuItem}
              style={{ padding: "6px 0" }}
            >
              <IconButton
                variant="outline"
                colorScheme="whiteAlpha"
                bg="#212121"
                onClick={onFontsClick}
                aria-label="fonts"
                icon={<FontIcon />}
              />
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

  return (
    <ChakraProvider>
      <MotionConfig
        transition={{ type: "spring", stiffness: 500, damping: 50 }}
      >
        <Flex h="100%">
          <Flex direction="column" className="content" flex={1} bg="gray.100">
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
                    bg="white"
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
                  bg="white"
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
                  bg={"white"}
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
          isOpen={sidebarOpen}
          pos="fixed"
          top={"12px"}
          right={"12px"}
          zIndex={100}
        />
      </MotionConfig>
    </ChakraProvider>
  );
});

export default App;
