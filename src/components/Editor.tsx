import React, { useEffect } from "react";
import CodeMirror from "codemirror";

interface IEditorProps {}

//TODO: setup codemirror editor
const Editor: React.FC<IEditorProps> = ({}) => {
  useEffect(() => {
    (async () => {
      //FIXME: look at codemirror docs and setup basic layout
      CodeMirror.fromTextArea;
    })();
  }, []);
  return (
    <div>
      <textarea id="realTimeEditor" />
    </div>
  );
};
export default Editor;
