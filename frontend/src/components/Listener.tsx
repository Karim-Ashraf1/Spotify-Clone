import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || "http://localhost:5000";

const Listener = () => {
  const [isListening, setIsListening] = useState(false);
  const [streamId, setStreamId] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isListening || !streamId) return;

    const socket = io(SIGNALING_SERVER_URL);
    const peer = new Peer({ initiator: false });

    let streamerId: string;

    socket.emit("room:join", streamId);

    socket.once("room:streamer-connected", (originId) => {
      streamerId = originId;
    });

    socket.on("peer:signal", (_, data) => {
      peer.signal(data);
    });

    peer.on("signal", (data) => {
      socket.emit("peer:signal", streamerId, data);
    });

    peer.on("stream", (stream) => {
      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current.play().catch(console.error);
      }
    });

    return () => {
      socket.disconnect();
      peer.destroy();
    };
  }, [isListening, streamId]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Listen to Stream</h1>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            value={streamId}
            onChange={({ target: { value } }) => setStreamId(value)}
            disabled={isListening}
            placeholder="Enter Stream ID"
            className="max-w-xs"
          />
          <Button
            onClick={() => streamId && setIsListening(true)}
            disabled={isListening || !streamId}
          >
            {isListening ? "Listening..." : "Listen to Stream"}
          </Button>
        </div>

        {isListening && (
          <audio
            ref={audioRef}
            controls
            autoPlay
            className="w-full max-w-md"
          />
        )}
      </div>
    </div>
  );
};

export default Listener; 