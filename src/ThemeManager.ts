import { computed, observable } from "mobx";
import { theme, extendTheme, ChakraTheme } from "@chakra-ui/react";
import { ComponentData } from "./types";
import { mapValues } from "lodash";
import evaluate from "./evaluate";

const DEFAULT_RENDERER = `({ size, variant }) => <Box size={size} variant={variant}>Hello</Box>`;
const DEFAULT_COMPONENT_THEME = `{
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {},
  // default values for 'size' and 'variant'
  defaultProps: {
    size: "md",
    colorScheme: "brand"
  },
}`;
const DEFAULT_GLOBAL_THEME = `{
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
    }
  },
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
    mono: "Menlo, monospace",
  },
  styles: {
    global: {
      a: {
        color: "brand.500",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  fontSizes: {},
  fontWeights: {},
  lineHeights: {},
  letterSpacings: {},
}`;
const DEFAULT_COMPONENTS: Record<string, ComponentData> = {
  Button: {
    render: `({ size, variant }) => <Button size={size} variant={variant}>Hello</Button>`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Button",
    name: "Buttons",
  },
  Checkbox: {
    render: `({ size, variant }) => <Checkbox size={size} variant={variant} />`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Checkbox",
    name: "Checkboxes",
  },
  Input: {
    render: `({ size, variant }) => <Input size={size} variant={variant} defaultValue="input" />`,
    overrides: DEFAULT_COMPONENT_THEME,
    key: "Input",
    name: "Inputs",
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

  addComponent({
    key,
    name,
    render = DEFAULT_RENDERER,
    overrides = DEFAULT_COMPONENT_THEME,
  }: ComponentData) {}

  get componentKeys() {
    return Object.keys(this.components);
  }

  setRawComponentOverrides(componentKey: string, overrides: string) {
    this.components[componentKey].overrides = overrides;
  }
  getRawComponentOverrides(componentKey: string): string {
    return this.components[componentKey].overrides;
  }
  getComponentOverrides(componentKey: string): string {
    return evaluate(this.components[componentKey].overrides) || {};
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

  setRawComponentRenderer(componentKey: string, renderer: string) {
    this.components[componentKey].render = renderer;
  }

  getRawComponentRenderer(componentKey: string) {
    return this.components[componentKey].render;
  }

  getComponentRenderer(componentKey: string) {
    return evaluate(this.components[componentKey].render);
  }

  setSelected(componentKey: string) {
    this.selected.componentKey = componentKey;
  }

  getSelected() {
    return this.selected.componentKey;
  }
}

export default new ThemeManager();
