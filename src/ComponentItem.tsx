import React, { useState, FC, useMemo } from "react";
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
  useColorModeValue,
  useColorModePreference,
} from "@chakra-ui/react";
import { ComponentData } from "./types";
import manager from "./ThemeManager";
import { observer } from "mobx-react-lite";
import { motion, Variants } from "framer-motion";
import MotionBox from "./MotionBox";
import evaluate from "./evaluate";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback: FC<any> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

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
    transform: "scale(.75)",
  },
};

const ComponentItem: FC<ComponentItemProps> = observer(
  ({ mode, componentKey }) => {
    const component = manager.components[componentKey];
    const theme = manager.theme;
    const variants = getVariants(theme, component.key);
    const sizes = getSizes(theme, component.key);

    const rendererStr = manager.getRawComponentRenderer(componentKey);

    const Renderer = useMemo(() => {
      return evaluate(rendererStr);
    }, [rendererStr]);

    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
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
            <Wrap w="133.33%" spacing={4}>
              {variants.map((variant) => (
                <Card
                  title={variant || "default"}
                  minWidth={"165px"}
                  alignSelf="stretch"
                >
                  <Box p={2}>{Renderer && <Renderer variant={variant} />}</Box>
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
                          minWidth={"165px"}
                          alignSelf="stretch"
                        >
                          <Box p={2}>
                            {Renderer && (
                              <Renderer size={size} variant={variant} />
                            )}
                          </Box>
                        </Card>
                      ))}
                    </Wrap>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Stack>
      </ErrorBoundary>
    );
  }
);

export default ComponentItem;

const Card: FC<any> = ({ title, children, ...otherProps }) => {
  const styles = useColorModeValue(
    {
      borderColor: "blackAlpha.400",
      bg: "white",
    },
    {
      borderColor: "whiteAlpha.400",
      bg: "gray.700",
    }
  );

  return (
    <Box
      rounded="lg"
      border="1px solid"
      borderColor={styles.borderColor}
      {...otherProps}
    >
      <Box p={2} borderBottom="1px solid" borderColor={styles.borderColor}>
        <Heading size="sm">{title}</Heading>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};
