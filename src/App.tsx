import React, { useState, FC } from "react";
import {
  Flex,
  Box,
  IconButton,
  SimpleGrid,
  ChakraProvider,
} from "@chakra-ui/react";
import { IoMdCode as CodeIcon, IoMdClose as CloseIcon } from "react-icons/io";
import "./App.css";
import { MotionConfig } from "framer-motion";
import MotionBox from "./MotionBox";
import ComponentItem from "./ComponentItem";
import manager from "./ThemeManager";
import { observer } from "mobx-react-lite";
import { Editor } from "./Editor";

const CodeButton: FC<any> = ({ onClick, isOpen, ...otherProps }) => {
  return (
    <IconButton
      {...otherProps}
      onClick={onClick}
      aria-label="show code"
      icon={isOpen ? <CloseIcon /> : <CodeIcon />}
    />
  );
};

// const DEFAULT_COMPONENTS: ComponentData[] = [
//   {
//     render: `({ size, variant }) => <Button size={size} variant={variant}>Test</Button>`,
//     theme: `({})`,
//     key: "Button",
//     name: "Buttons",
//   },
// ];

const App = observer(() => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [components, setComponents] = useState();

  return (
    <ChakraProvider>
      <MotionConfig
        transition={{ type: "spring", stiffness: 500, damping: 50 }}
      >
        <Flex h="100%">
          <Flex direction="column" className="content" flex={1} bg="gray.200">
            <Flex
              className="header"
              h="64px"
              bg="gray.800"
              align="center"
              justify="space-between"
              px={4}
            >
              <Box />
            </Flex>
            <Box className="main" flex={1} pos="relative">
              <SimpleGrid columns={2} spacing={8} p={8}>
                {manager.componentKeys.map((componentKey) => (
                  <Box
                    key={componentKey}
                    height="200px"
                    bg="white"
                    overflow="hidden"
                    rounded="xl"
                    onClick={() => manager.setSelected(componentKey)}
                    transition="transform .25s"
                    _hover={{ transform: "scale(1.025)" }}
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
                {manager.getSelected() && (
                  <Box
                    pos="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    bg={"white"}
                    overflowY="auto"
                  >
                    <ComponentItem
                      mode="expanded"
                      componentKey={manager.getSelected()}
                    />
                  </Box>
                )}
              </SimpleGrid>
            </Box>
          </Flex>
          <MotionBox
            className="sidebar"
            bg="yellow.400"
            w="480px"
            animate={{
              marginRight: sidebarOpen ? 0 : "-480px",
            }}
          >
            <Editor
              value={manager.getRawGlobalOverrides()}
              onChange={(val) => manager.setRawGlobalOverrides(val)}
            />
          </MotionBox>
          <CodeButton
            onClick={() => setSidebarOpen((p) => !p)}
            isOpen={sidebarOpen}
            pos="fixed"
            top={"12px"}
            right={"12px"}
            zIndex={100}
          />
        </Flex>
      </MotionConfig>
    </ChakraProvider>
  );
});

export default App;
