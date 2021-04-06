import * as Chakra from "@chakra-ui/react";
import * as Babel from "@babel/standalone";
import * as React from "react";

window.React = React;
Object.assign(window, Chakra);

const evaluate = (code: string) => {
  code = `(${code})`;
  try {
    const transpiled = Babel.transform(code, { presets: ["env", "react"] })
      .code;
    return transpiled ? eval(transpiled) : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default evaluate;
