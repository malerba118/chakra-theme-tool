import { observable } from "mobx";
import { theme, extendTheme, ChakraTheme } from "@chakra-ui/react";
import { ComponentData } from "./types";
import { mapValues } from "lodash";
import evaluate from "./evaluate";

const DEFAULT_RENDERER = `({ size, variant }) => <Box size={size} variant={variant}>Hello</Box>`;
const DEFAULT_THEME = `{}`;
const DEFAULT_COMPONENTS: Record<string, ComponentData> = {
  Button: {
    render: `({ size, variant }) => <Button size={size} variant={variant}>Test</Button>`,
    overrides: `{}`,
    key: "Button",
    name: "Buttons",
  },
  Button2: {
    render: `({ size, variant }) => <Button size={size} variant={variant}>Test</Button>`,
    overrides: `{}`,
    key: "Button",
    name: "Buttons",
  },
  Button3: {
    render: `({ size, variant }) => <Button size={size} variant={variant}>Test</Button>`,
    overrides: `{}`,
    key: "Button",
    name: "Buttons",
  },
  Button4: {
    render: `({ size, variant }) => <Button size={size} variant={variant}>Test</Button>`,
    overrides: `{}`,
    key: "Button",
    name: "Buttons",
  },
};

class ThemeManager {
  global = observable<any>({
    overrides: `{}`,
  });
  components = observable<Record<string, ComponentData>>(DEFAULT_COMPONENTS);
  selected = observable<any>({
    componentKey: null,
  });

  addComponent({
    key,
    name,
    render = DEFAULT_RENDERER,
    overrides = DEFAULT_THEME,
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

  getTheme(): ChakraTheme {
    // TODO: transpile and eval these before returning theme obj
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
