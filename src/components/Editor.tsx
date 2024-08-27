import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

interface IEditorProps {}

//TODO: setup codemirror editor
const EditorComp: React.FC<IEditorProps> = ({}) => {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    (async () => {})();
  }, []);
  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="//some comment"
        theme="vs-dark"
        value={value as string}
        onChange={(v) => setValue(v as string)}
      />
      <p>this is a sample editor</p>
    </div>
  );
};
export default EditorComp;
