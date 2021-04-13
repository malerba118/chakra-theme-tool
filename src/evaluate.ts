import * as Chakra from "@chakra-ui/react";
import * as Babel from "@babel/standalone";
import * as React from "react";
// @ts-ignore
import safeEval from "safer-eval/lib/browser";

const evaluate = (code: string) => {
  "use strict";
  code = `(${code})`;
  try {
    let transpiled = Babel.transform(code, {
      presets: ["env", "react"],
      sourceType: "script",
    }).code;
    const result = transpiled
      ? safeEval(transpiled, { ...Chakra, Chakra, React, window })
      : null;
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default evaluate;
