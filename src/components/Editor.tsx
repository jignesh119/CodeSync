import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Socket } from "socket.io-client";
import * as Actions from "../Actions.json";

interface IEditorProps {
  socketRef: Socket | null;
  roomId: string | undefined;
}

interface ActionsType {
  [k: string]: string;
}
const EditorComp: React.FC<IEditorProps> = ({ socketRef, roomId }) => {
  const [value, setValue] = useState<string | null>(null);
  const editorRef = useRef(null);
  const actions: ActionsType = Actions;
  useEffect(() => {
    (async () => {})();
  }, []);
  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };
  const onChange = (v: string | undefined, ev: any) => {
    setValue(v as string);
    // console.log(`value: ${v}\n ev:${JSON.stringify(ev)}`);
    // TODO: emit code change and configure endpoint
    socketRef?.emit(actions.CODE_CHANGE, { roomId, value });
  };
  return (
    <div>
      <Editor
        height="90vh"
        language="javascript"
        defaultValue="//some comment"
        theme="vs-dark"
        value={value as string}
        onChange={onChange}
        onMount={onMount}
      />
      <p>this is a sample editor</p>
    </div>
  );
};
export default EditorComp;
