import React, { useRef, useState, FC, useEffect } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/jsx/jsx.js";
import "codemirror/mode/css/css.js";
import "codemirror/theme/material-darker.css";
import { UnControlled as Codemirror } from "react-codemirror2";
import { Editor as CodeMirrorEditor, EditorConfiguration } from "codemirror";
import { Box, Flex, Tabs, Tab, TabList } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import manager from "./ThemeManager";
import debounce from "lodash/debounce";

const debounced = {
  setRawGlobalOverrides: debounce(
    (val) => manager.setRawGlobalOverrides(val),
    500
  ),
  setRawComponentOverrides: debounce(
    (componentKey, val) => manager.setRawComponentOverrides(componentKey, val),
    500
  ),
  setRawComponentRenderer: debounce(
    (componentKey, val) => manager.setRawComponentRenderer(componentKey, val),
    500
  ),
};

interface EditorProps {}

const value = manager.getRawGlobalOverrides();

export const Editor: FC<EditorProps> = observer(() => {
  const editorRef = useRef<CodeMirrorEditor>();
  const value = manager.getRawGlobalOverrides();
  const componentKey = manager.getSelected();
  const [selectedTab, setSelectedTab] = useState("global");

  const tabs = ["global"];
  if (componentKey) {
    tabs.push(componentKey);
    tabs.push("render");
  }

  useEffect(() => {
    setSelectedTab(componentKey || "global");
  }, [componentKey]);

  let editorVals: any = {};

  if (selectedTab === "global") {
    editorVals.value = manager.getRawGlobalOverrides();
    editorVals.setValue = debounced.setRawGlobalOverrides;
  } else if (selectedTab === componentKey) {
    editorVals.value = manager.getRawComponentOverrides(componentKey);
    editorVals.setValue = (val: string) =>
      debounced.setRawComponentOverrides(componentKey, val);
  } else if (selectedTab === "render") {
    editorVals.value = manager.getRawComponentRenderer(componentKey);
    editorVals.setValue = (val: string) =>
      debounced.setRawComponentRenderer(componentKey, val);
  }

  return (
    <Flex direction="column" h="100%" w="100%">
      <Flex
        h="64px"
        bg="#212121"
        borderBottom="1px solid"
        borderLeft="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Tabs
          h="100%"
          colorScheme="blue"
          color="whiteAlpha.800"
          variant="unstyled"
          index={tabs.indexOf(selectedTab)}
          onChange={(index) => setSelectedTab(tabs[index])}
        >
          <TabList h="100%">
            {tabs.map((tab) => (
              <Tab
                fontSize="xs"
                textTransform="uppercase"
                key={tab}
                w="92px"
                color={'whiteAlpha.700'}
                marginBottom='-1px'
                _selected={{ color: "white", borderBottom: '1px solid white' }}
                _hover={{ bg: "whiteAlpha.100" }}
                _focus={{ boxShadow: "none" }}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Flex>
      <Box h="calc(100% - 64px)" w="100%">
        <Codemirror
          key={selectedTab}
          editorDidMount={(editor) => {
            editorRef.current = editor;
            editor.setSize("100%", "100%");
            // Hacky, but needed to get editor
            // to size properly after mount
            setTimeout(() => {
              editor.refresh();
            }, 0);
          }}
          options={{
            theme: "material-darker",
            mode: "jsx",
            lineNumbers: true,
            tabSize: 2,
          }}
          className="editor"
          detach
          value={editorVals.value}
          onChange={(_, __, val) => editorVals.setValue(val)}
        />
      </Box>
    </Flex>
  );
});
