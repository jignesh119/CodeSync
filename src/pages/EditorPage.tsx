import React, { useEffect, useRef } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../io";
import { Socket } from "socket.io-client";
//TODO: import from json file
import * as Actions from "../Actions.json";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";

interface ActionsType {
  [k: string]: string;
}

const EditorPage = () => {
  //NOTE: if value in useRef changes, no rerender is done, => sockets || on rerender value is not changed
  let socketRef = useRef<Socket | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = React.useState([
    { socketId: 1, username: "pawrStar" },
    { socketId: 2, username: "jagun" },
    { socketId: 3, username: "cbn" },
  ]);

  const handleErrors = (err: Error) => {
    console.log(`Error with ws client: ${err}`);
    toast.error("socket connection failed");
    navigate("/");
  };

  if (!location.state) return <Navigate to={"/"} />;

  useEffect(() => {
    const actions: ActionsType = Actions;
    (async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      socketRef.current.on("ERR_CONNECTION_REFUSED", (err) => {
        handleErrors(err);
      });

      socketRef.current.emit(actions.JOIN, {
        roomId,
        username: location?.state?.username,
      });

      socketRef.current.on(actions.USER_JOINED, (username) => {
        console.log(`${username} joined`);
        if (username !== location.state.username) {
          toast.success(`${username} joined`);
        }
      });
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
