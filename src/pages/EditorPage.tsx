import React, { useEffect, useRef } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../io";
import { Socket } from "socket.io-client";
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
  const codeRef = useRef<string | null>(null);

  const [clients, setClients] = React.useState<
    { socketId?: string; username: string }[]
  >([{ username: location.state.username }]);

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
        username: location.state?.username,
      });

      socketRef.current.on(
        actions.USER_JOINED,
        ({ clients, username, socketId }) => {
          setClients(clients);
          if (username !== location.state.username) {
            toast.success(`${username} joined`);
          }

          //NOTE: the code to send to sync cant stored in useState as on each key stroke, state is updated=>useRef
          socketRef.current?.emit(actions.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        },
      );
      // socketRef.current.on(actions.JOINED, ({ clients, username }) => {
      //   if (username !== location.state?.username) {
      //     toast.success(`${username} joined the room.`);
      //     console.log(`${username} joined`);
      //   }
      //   setClients(clients);
      // });

      socketRef.current.on(actions.DISCONNECTED, ({ socketId, username }) => {
        setClients((prev) => prev.filter((c) => c.socketId !== socketId));
        toast.success(`User ${username} disconnected`);
      });

      // socketRef.current.on(
      //                ACTIONS.DISCONNECTED,
      //                ({ socketId, username }) => {
      //                    toast.success(`${username} left the room.`);
      //                    setClients((prev) => {
      //                        return prev.filter(
      //                            (client) => client.socketId !== socketId
      //                        );
      //                    });
      //                }
      //            );
      //
    })();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(actions.JOINED);
      socketRef.current?.off(actions.DISCONNECTED);
    };
  }, []);
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId as string);
      toast.success("Room ID copied to clipboard");
    } catch (error) {
      console.log(`Error copying to clipboard: ${error}`);
      toast.error("Error copying to clipboard");
    }
  };
  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-sync.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients?.map((client) => (
              <Client
                key={client.socketId + Math.random().toString()}
                username={client.username}
              />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef.current}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code as string;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
