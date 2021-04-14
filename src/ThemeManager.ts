import { computed, observable } from "mobx";
import { theme, extendTheme, ChakraTheme } from "@chakra-ui/react";
import { ComponentData } from "./types";
import { mapValues } from "lodash";
import evaluate from "./evaluate";
// @ts-ignore
import { stringify } from "javascript-stringify";

const getDefaultRenderer = (
  componentKey: string
) => `// Specify what to render for each size and variant
({ size, variant }) => {
  const sx = useStyleConfig('${componentKey}', { size, variant })

  return (
    <Box sx={sx}>
      Hello
    </Box>
  )
}`;
const DEFAULT_COMPONENT_THEME = `// Specify theme overrides for this component
{
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {},
  // override default props on this component
  defaultProps: {
    size: "md",
    colorScheme: "brand"
  },
}`;
const DEFAULT_GLOBAL_THEME = `// Specify global theme overrides
{
  colors: {
    brand: {
      50: '#f5e3ff',
      100: '#d8b2ff',
      200: '#bd80ff',
      300: '#a34dff',
      400: '#881bfe',
      500: '#6f02e5',
      600: '#5600b3',
      700: '#3e0081',
      800: '#25004f',
      900: '#0e001f',
    },
     gray: {
      50: "#f1f3fb",
      100: "#d3d5dc",
      200: "#b6b8be",
      300: "#9a9ba1",
      400: "#7f8084",
      500: "#656669",
      600: "#4c4c4f",
      700: "#343536",
      800: "#1e1e1f",
      900: "#030304"
    }
  },
  fonts: {
    body: "Inconsolata, sans-serif",
    heading: "Inconsolata, serif",
    mono: "Inconsolata, monospace",
  },
  styles: {
    global: ({ colorMode }) => ({
      body: {
        bg: colorMode === "dark" ? "gray.800" : "gray.50"    
      },
      _focusVisible: {
        boxShadow: "0 0 0 3px #d8b2ff !important"
      }
    }),
  },
  fontSizes: {},
  fontWeights: {},
  lineHeights: {},
  letterSpacings: {},
}`;

const DEFAULT_COMPONENTS: Record<string, ComponentData> = {
  Alert: {
    render: `({ size, variant }) => (
  <Alert size={size} variant={variant} colorScheme="brand">
    <AlertIcon />
    <AlertTitle mr={2}>Hello!</AlertTitle>
    <AlertDescription>Just saying hi.</AlertDescription>
  </Alert>
)`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Alert",
    name: "Alerts",
  },
  Badge: {
    render: `({ size, variant }) => (
  <Badge 
    size={size} 
    variant={variant} 
  >
    Hello
  </Badge>
)`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Badge",
    name: "Badges",
  },
  Button: {
    render: `({ size, variant }) => (
  <Button 
    size={size} 
    variant={variant}
  >
    Hello
  </Button>
)`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Button",
    name: "Buttons",
  },
  Checkbox: {
    render: `({ size, variant }) => (
  <Checkbox 
    size={size} 
    variant={variant} 
  />
)`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Checkbox",
    name: "Checkboxes",
  },
  Heading: {
    render: `({ size, variant }) => (
  <Heading 
    size={size} 
    variant={variant} 
  >
    Hello
  </Heading>
)`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Heading",
    name: "Headings",
  },
  Input: {
    render: `({ size, variant }) => (
  <Input 
    size={size} 
    variant={variant} 
    placeholder="hello..." 
  />
)`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Input",
    name: "Inputs",
  },
  Spinner: {
    render: `({ size, variant }) => (
  <Spinner
    size={size}
    variant={variant}
    thickness="4px"
    speed="0.65s"
  />
)`,
    overrides: `// Specify theme overrides for this component
{
  // style object for base or default style
  baseStyle: {
    color: "brand.300"
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {},
  // override default props on this component
  defaultProps: {
    size: "md",
  },
}`,
    key: "Spinner",
    name: "Spinners",
  },
  Tabs: {
    render: `({ size, variant }) => (
  <Tabs size={size} variant={variant}>
    <TabList>
      <Tab>One</Tab>
      <Tab>Two</Tab>
      <Tab>Three</Tab>
    </TabList>
  </Tabs>
)`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Tabs",
    name: "Tabs",
  },
  Tag: {
    render: `({ size, variant }) => (
  <Tag 
    size={size} 
    variant={variant} 
  >
    Hello
  </Tag>
)`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Tag",
    name: "Tags",
  },
};

class ThemeManager {
  global = observable<any>({
    overrides: DEFAULT_GLOBAL_THEME,
  });
  components = observable<Record<string, ComponentData>>(DEFAULT_COMPONENTS);
  selected = observable<any>({
    componentKey: null,
  });
  fonts = observable<string>(["Inconsolata"]);

  constructor({ global, components, fonts }: any = {}) {
    if (global) {
      this.global = observable(global);
    }
    if (components) {
      this.components = observable(components);
    }
    if (fonts) {
      this.fonts = observable(fonts);
    }
  }

  @computed
  get data() {
    return {
      global: this.global,
      components: this.components,
      fonts: this.fonts,
    };
  }

  addComponent = ({
    key,
    name,
    render = getDefaultRenderer(key),
    overrides = DEFAULT_COMPONENT_THEME,
  }: ComponentData) => {
    this.components[key] = {
      key,
      name,
      render,
      overrides,
    };
  };

  removeComponent(componentKey: string) {
    delete this.components[componentKey];
  }

  get componentKeys() {
    return Object.keys(this.components);
  }

  setRawComponentOverrides(componentKey: string, overrides: string) {
    this.components[componentKey].overrides = overrides;
  }
  getRawComponentOverrides(componentKey: string): string {
    return this.components[componentKey].overrides;
  }
  getComponentOverrides(componentKey: string): any {
    const val = evaluate(this.components[componentKey].overrides);
    return val;
  }

  getGlobalOverrides() {
    return evaluate(this.global.overrides) || {};
  }
  getRawGlobalOverrides() {
    return this.global.overrides;
  }
  setRawGlobalOverrides(overrides: string) {
    this.global.overrides = overrides;
  }

  @computed
  get theme(): ChakraTheme {
    const components = mapValues(this.components, (data) =>
      this.getComponentOverrides(data.key)
    );
    return extendTheme(
      {
        ...this.getGlobalOverrides(),
        components,
      },
      theme
    );
  }

  @computed
  get themeStr(): string {
    const components = mapValues(this.components, (data) =>
      this.getComponentOverrides(data.key)
    );
    const obj = {
      ...this.getGlobalOverrides(),
      components,
    };
    let result = "";
    try {
      result = "export const theme = " + stringify(obj, null, 2) || "";
    } catch (err) {
      console.error("Unable to export theme file", err);
    }
    return result;
  }

  setRawComponentRenderer(componentKey: string, renderer: string) {
    this.components[componentKey].render = renderer;
  }

  getRawComponentRenderer(componentKey: string) {
    return this.components[componentKey]?.render || "";
  }

  getComponentRenderer(componentKey: string) {
    return evaluate(this.components[componentKey].render);
  }

  setSelected(componentKey: string | null) {
    this.selected.componentKey = componentKey;
  }

  getSelected() {
    return this.selected.componentKey;
  }

  selectFont(font: string) {
    this.fonts.push(font);
  }

  unselectFont(font: string) {
    this.fonts.splice(this.fonts.indexOf(font), 1);
  }

  getSelectedFonts() {
    return this.fonts;
  }
}

const data = localStorage.getItem("data");

export default new ThemeManager(data ? JSON.parse(data) : {});
