import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

interface IEditorProps {}

const EditorComp: React.FC<IEditorProps> = ({}) => {
  const [value, setValue] = useState<string | null>(null);
  const editorRef = useRef(null);
  useEffect(() => {
    (async () => {})();
  }, []);
  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };
  return (
    <div>
      <Editor
        height="90vh"
        language="javascript"
        defaultValue="//some comment"
        theme="vs-dark"
        value={value as string}
        onChange={(v) => setValue(v as string)}
        onMount={onMount}
      />
      <p>this is a sample editor</p>
    </div>
  );
};
export default EditorComp;
