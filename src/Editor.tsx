import React, { useRef, useEffect, FC } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/jsx/jsx.js";
import "codemirror/mode/css/css.js";
import "codemirror/theme/dracula.css";
import { Controlled as Codemirror } from "react-codemirror2";
import { Editor as CodeMirrorEditor, EditorConfiguration } from "codemirror";

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const Editor: FC<EditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<CodeMirrorEditor>();

  return (
    <Codemirror
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
        theme: "dracula",
        mode: "jsx",
        lineNumbers: true,
        tabSize: 2,
      }}
      className="editor"
      value={value}
      onBeforeChange={(_, __, val) => onChange(val)}
    />
  );
};
