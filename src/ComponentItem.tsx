import React, { useState, FC } from "react";
import {
  Accordion,
  AccordionItem,
  Box,
  Heading,
  HStack,
  Stack,
  Wrap,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  ChakraProvider,
} from "@chakra-ui/react";
import { ComponentData } from "./types";
import manager from "./ThemeManager";
import { observer } from "mobx-react-lite";
import { motion, Variants } from "framer-motion";
import MotionBox from "./MotionBox";

interface ComponentItemProps {
  mode: "grid-item" | "list-item" | "expanded";
  componentKey: string;
}

// interface SizeVariant {
//   size: string | undefined;
//   variant: string | undefined;
// }

// const enumerateSizeVariants = (
//   sizes: Array<string | undefined>,
//   variants: Array<string | undefined>
// ): SizeVariant[] => {
//   let sizeVariants: SizeVariant[] = [];
//   sizes.forEach((size) => {
//     variants.forEach((variant) => {
//       sizeVariants.push({
//         size,
//         variant,
//       });
//     });
//   });
//   return sizeVariants;
// };

const getSizes = (theme: any, componentKey: string) => {
  let sizes: Array<string | undefined> = Object.keys(
    theme.components[componentKey]?.sizes || {}
  );
  sizes.push(undefined);
  return sizes;
};

const getVariants = (theme: any, componentKey: string) => {
  let sizes: Array<string | undefined> = Object.keys(
    theme.components[componentKey]?.variants || {}
  );
  sizes.push(undefined);
  return sizes;
};

const animationVariants: any = {
  expanded: {
    transform: "scale(1)",
  },
  "grid-item": {
    transform: "scale(.5)",
  },
};

const ComponentItem: FC<ComponentItemProps> = observer(
  ({ mode, componentKey }) => {
    const component = manager.components[componentKey];
    const theme = manager.theme;
    const variants = getVariants(theme, component.key);
    const sizes = getSizes(theme, component.key);

    const renderer = manager.getComponentRenderer(componentKey);

    return (
      <ChakraProvider theme={theme}>
        <Stack
          style={{
            transformOrigin: "0 0",
            ...animationVariants[mode],
          }}
          p={8}
        >
          <Heading size="xl" pb={2}>
            {component.name}
          </Heading>
          {mode === "grid-item" && (
            <Wrap w="200%" spacing={4}>
              {variants.map((variant) => (
                <Card
                  title={variant || "default"}
                  minWidth={"180px"}
                  alignSelf="stretch"
                >
                  <Box p={2}>{renderer?.({ variant })}</Box>
                </Card>
              ))}
            </Wrap>
          )}
          {mode === "expanded" && (
            <Accordion defaultIndex={0}>
              {sizes.map((size) => (
                <AccordionItem>
                  <AccordionButton>
                    <Heading size="md" py={2}>
                      {size || "default"}
                    </Heading>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel py={4}>
                    <Wrap spacing={4}>
                      {variants.map((variant) => (
                        <Card
                          title={variant || "default"}
                          minWidth={"180px"}
                          alignSelf="stretch"
                        >
                          <Box p={2}>{renderer?.({ size, variant })}</Box>
                        </Card>
                      ))}
                    </Wrap>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Stack>
      </ChakraProvider>
    );
  }
);

export default ComponentItem;

const Card: FC<any> = ({ title, children, ...otherProps }) => {
  return (
    <Box rounded="lg" border="1px solid" borderColor="gray.200" {...otherProps}>
      <Box p={2} borderBottom="1px solid" borderColor="gray.200">
        <Heading size="sm">{title}</Heading>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};
