import React, { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  ChakraProvider,
  ColorModeScript,
  useToast,
  Box,
  Code,
  Button,
} from "@chakra-ui/react";
import reportWebVitals from "./reportWebVitals";
import "focus-visible/dist/focus-visible";
import manager from "./ThemeManager";
import { observer } from "mobx-react-lite";
import { ErrorBoundary } from "react-error-boundary";

const ErrorToast: FC<any> = ({ error, resetErrorBoundary }) => {
  const toast = useToast();

  useEffect(() => {
    // alert("maybe");
    // toast({
    //   description:
    //     "Oops, it looks like there's an error in your theme. Now using a fallback theme. Please fix the code and refresh.",
    //   status: "error",
    // });
    const toastId = toast({
      duration: 100000,
      isClosable: false,
      render: () => (
        <Box color="whiteAlpha.700" p={3} bg="red.500">
          Oops, encountered an error in your theme:{" "}
          <Code colorScheme="whiteAlpha">{error.message}</Code>. Using a
          fallback theme instead. Please fix and{" "}
          <Button
            variant="link"
            colorScheme="white"
            onClick={() => resetErrorBoundary()}
          >
            try again.
          </Button>
        </Box>
      ),
    });

    return () => {
      if (toastId) toast.close(toastId);
    };
  }, []);

  return null;
};

const ErrorFallback: FC<any> = ({ error, resetErrorBoundary }) => {
  return (
    <ChakraProvider>
      <App />
      <ErrorToast error={error} resetErrorBoundary={resetErrorBoundary} />
    </ChakraProvider>
  );
};

const ThemedApp = observer(() => {
  const theme = manager.theme;
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ErrorBoundary>
  );
});

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={"light"} />
    <ThemedApp />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
