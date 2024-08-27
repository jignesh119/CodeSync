import React, { useEffect, useRef } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../io";
import { Socket } from "socket.io-client";
import Actions from "../Actions.js";
import { useLocation } from "react-router-dom";

const EditorPage = () => {
  //NOTE: if value in useRef changes, no rerender is done, => sockets || on rerender value is not changed
  let socketRef = useRef<Socket | null>(null);
  const location = useLocation();
  const [clients, setClients] = React.useState([
    { socketId: 1, username: "pawrStar" },
    { socketId: 2, username: "jagun" },
    { socketId: 3, username: "cbn" },
  ]);

  useEffect(() => {
    (async () => {
      socketRef.current = await initSocket();
      // socketRef.current.emit(Actions.JOIN, {
      //   roomId,
      //   username: location?.state?.username,
      // });
    })();
  }, []);

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-sync.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn">Copy ROOM ID</button>
        <button className="btn leaveBtn">Leave</button>
      </div>
      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
